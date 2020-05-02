import { Component, OnInit } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
// 6.4.2 Implementovati OnInit
export class AppComponent implements OnInit{
  jwtHelper = new JwtHelperService();
  constructor(private authService: AuthService) {}
  ngOnInit() {
    const token = localStorage.getItem('token');
    // 11.14.2 Dodati dio za sliku ->nav.componenet.ts
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this.authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    // 11.14.2
    if (user) {
      this.authService.currentUser = user;
      // 11.16.3 pozvati metod da se updejta photo kad se korisnik loguje ->member-edit.ts
      this.authService.changeMemberPhoto(user.photoUrl);
    }
  }
}
