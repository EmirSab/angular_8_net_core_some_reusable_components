import { Injectable } from '@angular/core';
// 6.2.3 Dodati alertify servis ->app.module.ts
declare let alertify: any;
@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() { }
  confirm(message: string, okCallback: () => any) {
    // tslint:disable-next-line: only-arrow-functions
    alertify.confirm(message, function(e) {
      if (e) {
        okCallback();
      } else {}
    }).setHeader('<em> Potvrdi</em> ');
  }
  success(message: string) {
    alertify.success(message);
  }
  error(message: string) {
    alertify.error(message);
  }
  warning(message: string) {
    alertify.warning(message);
  }
  message(message: string) {
    alertify.message(message);
  }
}
