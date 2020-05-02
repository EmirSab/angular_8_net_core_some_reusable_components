import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 4.4.2 Dodati logiku za auth i login() i base url ->nav.ts
  // 9.4.3 Dodati globalni url -> user.service
  baseUrl = environment.apiUrl + 'auth/';
  // 6.3.1 Dodati jwt helper ->nav.ts
  jwtHelper = new JwtHelperService();
  // 6.4 dodavanje decoded tokena ->nav.html
  decodedToken: any;
  // 11.16 Dodati BehaviouralSubject()
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  // 11.14.2 Dodati properti za trenutnog usera ->app.component.ts
  currentUser: User;
  constructor(private http: HttpClient) { }

  // 11.16 Dodati metod changeMemberPhoto >nav.component.ts
  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.token);
          // 11.14.2
          localStorage.setItem('user', JSON.stringify(user.user));
          // 6.4
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          // 11.14.2
          this.currentUser = user.user;
          // 11.16
          this.changeMemberPhoto(this.currentUser.photoUrl);
          // console.log(this.decodedToken);
        }
      })
    );
  }
  // 4.10 Dodati register()
  // 12.10.1 mjesto modela uzimat cemo usera ->member-card.html
  register(user: User) {
    return this.http.post(this.baseUrl + 'register', user);
  }

  // 6.3.1
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  // 20.16 Napraviti roleMatch() ->routes.ts
  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const userRoles = this.decodedToken.role as Array<string>;
    allowedRoles.forEach(element => {
      if (userRoles.includes(element)) {
        isMatch = true;
        return;
      }
    });
    return isMatch;
  }
}
