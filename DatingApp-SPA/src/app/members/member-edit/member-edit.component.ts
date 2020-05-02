import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  // 10.2.7 Dodati logiku sa resolverom
  user: User;
  // 11.16.4
  photoUrl: string;
  @ViewChild('editForm', {static: false}) editForm: NgForm;
  // 10.5.3 Dodati logiku za ne moze window zatvoriti
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }
  constructor(private route: ActivatedRoute,
              private alertify: AlertifyService,
              private userService: UserService,
              private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });
    // 11.16.4 Pozvati metod za updejtanje photo u navbaru ->member-edit.html
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  // 10.7.1 prepraviti updateUser()
  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(
      next => {
        // console.log(this.user);
        this.alertify.success('Uspjesno updejtovan');
        // resetovati stanje forme ali dati mu parametar da ne bi brisao podatke
        this.editForm.reset(this.user);
      }, error => {
        this.alertify.error(error);
      }
    );

  }

  // 11.13.2 Dodati updateMainPhoto()
  updateMainPhoto(photoUrl) {
    this.user.photoUrl = photoUrl;
  }

}
