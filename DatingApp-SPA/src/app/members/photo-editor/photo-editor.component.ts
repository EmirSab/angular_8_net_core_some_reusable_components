import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  // 11.7.2 Bit ce child of member-edit komponente ->photo-editor.html
  @Input() photos: Photo[];
  // 10.13 Dodati sliku bez refresha preko eventa ->member-edit.html
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  // 11.8.1 Dodati dio za ts iz ng2-file upload ->app.module.ts
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  // 11.12 Dodati dio koji ce odma sliku prikazati
  currentMain: Photo;

  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    // 11.9 Dodati ovaj dio da se slika moze dodati
    this.uploader.onAfterAddingFile = (file) => {file.withCredentials = false; };
    // 11.9.2 Cim se photo uploada da se prikaze
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
          // 20.23.5 dodati property -> photo-editor.html
          isApproved: res.isApproved
        };
        this.photos.push(photo);
        // 12.11.3 Dodati sliku pri registraciji i ako je main ne stavljati defaultnu sliku
        // pri uplodu prve slike da se na svim mjestima izmjeni
        if (photo.isMain) {
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }

      }
    };
  }

  // 10.11.1 Dodati setMainPhoto ->photo-editor.html
  setMainPhoto(photo: Photo) {
    this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
      // 10.12
      this.currentMain = this.photos.filter(p => p.isMain === true)[0];
      this.currentMain.isMain = false;
      photo.isMain = true;
      // 11.13
      // this.getMemberPhotoChange.emit(photo.url);
      // 11.16.6 pozvati metod kada se klikne da se promjene obje fotografije
      this.authService.changeMemberPhoto(photo.url);
      // 11.16.6 updejt u localstoregu
      this.authService.currentUser.photoUrl = photo.url;
      localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
    }, error => {
      this.alertify.error(error);
    });
  }
  // 11.18.1 Dodati delete metod ->photo-editor.html
  deletePhoto(id: number) {
    this.alertify.confirm('Jesi siguran da zelis izbrisati ovu fotografiju', () => {
      this.userService.deletePhoto(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(p => p.id === id), 1);
        this.alertify.success('Fotografija je izbrisana');
      }, error => {
        this.alertify.error('Fotografija nije izbrisana');
      });
    });
  }
}
