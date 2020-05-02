import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  // 9.10 Dodati logiku da se svi useri lodaju ->member-detail.html
  user: User;
  // 9.14.1 Dodati propertije za galleriju ->member-details.html
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  // 16.12.1 Dodati ViewChild ->member-detailed.html
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent;
  constructor(private userService: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // 9.13.3 mjesto pozivanje loadUser dodati logiku sa resolverom
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    // 16.12.4 Dodati query params da bi se moglo subscribati na poruke ->member-card.html
    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });
    // 9.14.1
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImages = this.getImages();
    // this.loadUser();
  }
  getImages() {
    const imageUrls = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }

  // 16.12.1
  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
  /*loadUser() {
    // tslint:disable-next-line: no-string-literal
    // plus se dodaje da bi se id izforsao da se prosljedi kao broj
    // tslint:disable-next-line: no-string-literal
    this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
      this.user = user;
    }, error => {
      this.alertify.error(error);
    });
  }*/

}
