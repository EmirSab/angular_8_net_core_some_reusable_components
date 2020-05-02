import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  
  // 4.3 Dodati logiku za login() ->nav.html
  // 4.5 prepraviti login() ->nav.html
  model: any = {};
  // 11.16.1 Dodati properti za promjenu fotografije u navu ->nav.componenet.html
  photoUrl: string;
  // 7.4 Dodati router -> _guards
  constructor(public authService: AuthService,
              private alertify: AlertifyService,
              private router: Router
    ) { }

  ngOnInit() {
    // 11.16.1
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  // 6.2.5 Dodati alertify servis ->register.ts
  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('Uspjesno logovan');
    }, error => {
      // 5.4.2 Dodait error -> error.interceptor
      this.alertify.error(error);
      // console.log('Korisnik se nije logovao');
    }, () => {
      this.router.navigate(['/members']);
    });
  }
  // 4.6.1 dodati loggedIn() i logout() ->nav.html
  loggedIn() {
    // 6.3.2 dodati novi nacin da li je user logovan
    return this.authService.loggedIn();
    // const token = localStorage.getItem('token');
    // return !!token;
  }
  logout() {
    localStorage.removeItem('token');
    // 11.14.4 U logout dodati izbacivanje usera ->nav.component.html
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('Odlogovan');
    this.router.navigate(['/home']);
    this.model = {};
  }
}
