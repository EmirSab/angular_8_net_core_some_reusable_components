import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  // 16.10.3 Dodati logiku da posiljaoca i primaoca poruke ->member-messages.html
  @Input() recipientId: number;
  messages: Message[];
  // 16.13.1 Dodati dio za slanje poruke -> member-messages.html
  newMessage: any = {};
  constructor(private userService: UserService,
              private authService: AuthService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  // 16.10.3
  loadMessages() {
    // + pretvoriti u broj
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
    // 16.17.2 prepraviti metod dodati pipe za read
    .pipe(
      tap(messages => {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
            this.userService.markAsRead(currentUserId, messages[i].id)
          }
        }
      })
    )
    // 16.17.2 kraj
      .subscribe(messages => {
        this.messages = messages;
      }, error => {
        this.alertify.error(error);
      });
  }

  // 16.13.3 Dodai sendMessage() ->MessagesController
  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage).subscribe((message: Message) => {
      this.messages.unshift(message);
      this.newMessage.component = '';
    }, error => {
      this.alertify.error(error);
    });
  }
}
