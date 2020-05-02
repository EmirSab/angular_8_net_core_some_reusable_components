import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
// 20.18.5 Dodati logiku servisa ->user.managment.ts
export class AdminService {
  baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }

 // 20.18.5 dohvacanje usera sa rolama
 getUsersWithRoles() {
   return this.http.get(this.baseUrl + 'admin/usersWithRoles');
 }

 // 20.21.3 Dodati novi metod za update ->user-managment.ts
 updateUserRoles(user: User, roles: {}) {
   return this.http.post(this.baseUrl + 'admin/editRoles/' + user.userName, roles);
 }

 // 20.23.12 Dodati nove metode ->photo-managment.ts
 getPhotosForApproval() {
  return this.http.get(this.baseUrl + 'admin/photosForModeration');
}

approvePhoto(photoId) {
  return this.http.post(this.baseUrl + 'admin/approvePhoto/' + photoId, {});
}

rejectPhoto(photoId) {
  return this.http.post(this.baseUrl + 'admin/rejectPhoto/' + photoId, {});
}
}
