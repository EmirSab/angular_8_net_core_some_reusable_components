import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
// 9.13 Dodati resolver da bi se mogao ? brisati sa html elemenata ->app.module.ts
@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    constructor(private userService: UserService,
                private router: Router,
                private alertify: AlertifyService) {}
        resolve(route: ActivatedRouteSnapshot): Observable<User> {
            return this.userService.getUser(route.params.id).pipe(
                catchError(error => {
                    this.alertify.error('Nema podataka');
                    this.router.navigate(['/members']);
                    return of(null);
                })
            );
        }
}

