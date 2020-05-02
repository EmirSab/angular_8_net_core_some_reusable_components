import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
// 7.5 kreirati guard ->app.module
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private alertify: AlertifyService) {}
  
  // 20.16.2
  canActivate(next: ActivatedRouteSnapshot): boolean {
    // uzimanje rola
    const roles = next.firstChild.data['roles'] as Array<string>;
    if (roles) {
      const match = this.authService.roleMatch(roles);
      if (match) {
        return true;
      } else {
        this.router.navigate(['members']);
        this.alertify.error('Samo admin moze pristupiti ovom djelu');
      }
    }
    if (this.authService.loggedIn()) {
      return true;
    }
    this.alertify.error('Nema prolaza');
    this.router.navigate(['/home']);
    return false;
  }
}
