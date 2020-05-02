import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.css']
})
export class UserManagmentComponent implements OnInit {
  // 20.18.6 Dohvatiti usere ->User.ts
  users: User[];
  // 20.18.7 ->user.managment.html
  // 20.19.3 Dodati dio za modal ->roles.modal.ts
  bsModalRef: BsModalRef;
  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }
  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      console.log(error);
    });
  }

  // 20.19.3
  // 20.20 Prosljediti podatke u modal ->roles.modal.ts
  editRolesModal(user: User) {
    const initialState = {
      // 20.20
      user,
      roles: this.getRolesArray(user)
    };
    this.bsModalRef = this.modalService.show(RolesModalComponent, {initialState});
    //this.bsModalRef.content.closeBtnName = 'Close';
    // 20.21.2 Dodati metod iz childa ->admin.service
    this.bsModalRef.content.updateSelectedRoles.subscribe((values) => {
      const rolesToUpdate = {
        roleNames: [...values.filter(el => el.checked === true).map(el => el.name)]
      };
      // 20.21.4 Doadati uslov za roleUpdate ->admin.panel.html
      if (rolesToUpdate) {
        this.adminService.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
        }, error => {
          console.log(error);
        });
      }
    });
   }

   // 20.20
   private getRolesArray(user) {
    const roles = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin'},
      {name: 'Moderator', value: 'Moderator'},
      {name: 'Member', value: 'Member'},
      {name: 'VIP', value: 'VIP'}
    ];

    // 20.20 kojim rolama user pripada
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0 ; i < availableRoles.length; i++) {
      let isMatch = false;
      // tslint:disable-next-line: prefer-for-of
      for (let k = 0; k < userRoles.length; k++) {
           if (availableRoles[i].name === userRoles[k]) {
             isMatch = true;
             availableRoles[i].checked = true;
             roles.push(availableRoles[i]);
             break;
           }
      }
      if (!isMatch) {
        availableRoles[i].checked = false;
        roles.push(availableRoles[i]);
      }
    }
    return roles;
   }
  }

