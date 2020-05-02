import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  // 9.6.1 Napraviti dio za ispisivanje usera ->member-card.html
  @Input() user: User;
  // 15.6.1 Dodati dio da user moze poslati like ->member-card.html
  constructor(private authService: AuthService, private alertify: AlertifyService, private userService: UserService) { }

  ngOnInit() {
  }
  // 15.6.1
  sendLike(id: number) {
    this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(data => {
      this.alertify.success('Lajkali ste usera ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });
  }
}
