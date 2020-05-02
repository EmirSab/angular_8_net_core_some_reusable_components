import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../_models/Pagination';
import { Message } from '../_models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  // 16.8.4 Dodati loadMessages() i pageChanged ->messages.component.html
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'Unread';
  constructor(private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // 16.8.4
    this.route.data.subscribe(data => {
      // tslint:disable-next-line:no-string-literal
      this.messages = data['messages'].result;
      // tslint:disable-next-line:no-string-literal
      this.pagination = data['messages'].pagination;
    });
  }
  loadMessages() {
    // tslint:disable-next-line: max-line-length
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
    .subscribe((res: PaginatedResult<Message[]>) => {
      this.messages = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertify.error(error);
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

  // 16.16.1 Dodati deleteMessage() -> messages.componenet.html
  deleteMessage(id: number) {
    this.alertify.confirm('Jeste li sigurni da zelite izbrisati ovu poruku', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('Poruka je izbrisana');
      }, error => {
        this.alertify.error('Poruka nije obrisana');
      });
    });
  }

}
