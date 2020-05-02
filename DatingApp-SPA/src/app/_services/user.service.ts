import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
// 9.9.2 zbrisati ->member-detail.ts
/*const httpOptions = {
    // tslint:disable-next-line: object-literal-key-quotes
    headers: new HttpHeaders({'Authorization': 'Bearer ' + localStorage.getItem('token')})
  };*/
@Injectable({
  providedIn: 'root'
})
// 9.4 Dodati user service ->enviroment.ts ->auth.service
export class UserService {
baseUrl = environment.apiUrl;
constructor(private http: HttpClient) { }
// 9.4.4 ->app.module.ts
// 14.6.1 Dodati dio za paginaciju ->member-list.resolver
// 14.10.4 Dodati dio za userParams
// 15.7 Dodati likesParams ->list.resolver.ts
  getUsers(page?, itemsPerPage?, userParams?, likesParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    // 14.10.4
    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      // 14.12.3 Dodati orderby u user.service
      params = params.append('orderBy', userParams.orderBy);
    }

    // 15.7 dodati likesParams
    if (likesParams === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likesParams === 'Likees') {
      params = params.append('likees', 'true');
    }
    return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params}).pipe(map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    }));
  }
  getUser(id): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }
  // 10.7 Dodati updateUser() ->member-edit
  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  // 10.11 Dodati SetMainPhoto() ->photo-editor.ts
  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  // 11.18 Dodati delete metod ->photo-editor.ts
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  // 15.6 Dodati sendLike() ->member-card.ts
  sendLike(id: number, recipiendId: number) {
    return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipiendId, {});
  }

  // 16.8.1 Dodati metod getMessages() ->messages.resolver
  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult();

    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
    .pipe(map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') !== null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    }));
  }
  
    // 16.10 Napraviti metod getMessageThread() ->member-messages.ts
  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  // 16.13 Napraviti sendMessage() -> member-messages.ts
  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  // 16.16 Dodati deleteMessage() ->messages.componenet.ts
  deleteMessage(id: number, userId: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  // 16.17.1 Dodati metod da li je read ili nije ->member-messages.ts
  markAsRead(userId: number, messageId: number) {
    this.http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }
}
