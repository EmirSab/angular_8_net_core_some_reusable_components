import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
  // 20.19.4 dodati dio za modal ->user.managment.html
  // 20.20.1 Prepraviti da bi dobijao podatke ->roles.modal.html
  // 20.21. role.modal je child od userManagment komponente da bi se prosljedili podaci sa child na parent ->roles.modal.html
  // koristi se output na child komponenti
  @Output() updateSelectedRoles = new EventEmitter();
  user: User;
  roles: any[];
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }
  // 20.21
  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }
 
}
