import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, TabsModule, BsDatepickerModule, PaginationModule, ButtonsModule, ModalModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';
import {TimeAgoPipe} from 'time-ago-pipe';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
// 4.3.2 Dodati forms module u import ->nav.html
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/hasRole.directive';
import { UserManagmentComponent } from './admin/user-managment/user-managment.component';
import { PhotoManagmentComponent } from './admin/photo-managment/photo-managment.component';
import { AdminService } from './_services/admin.service';
import { RolesModalComponent } from './admin/roles-modal/roles-modal.component';



// 4.4.1 Dodati auth.service u providers ->auth.ts
// 5.4.1 Dodati ErrorInterceptorProvider ->nav.ts
// 6.2.4 Dodati alertify servis u providers ->nav.ts
// 6.5.1 Dodati ngx bootstrap ->nav.html
// 7.2.1 Dodati RoutetModule u imports da bi se mogle koristiti rute ->nav.html
// 7.5.1 Dodati authguard ->routes.ts
// 9.4.5 Dodati user.service->member-list.ts
// 9.6 Dodati member-card komponentu -member-card.ts
// 9.9.1 Dodati uzimanje tokena -> user.service
// 9.12.1 Dodati TabsModule ->member-datail.html
// 9.13.1 Dodati resolver u providers -> routes.ts
// 9.14 Dodati gallery ngx-gallery ->member-detail.ts
// 10.2.1 Dodati member-edit komponentu ->routes.ts
// 10.2.5 Dodati member-edit.resolver ->routes.ts
// Dodati prevent-unsaved-guard ->routes.ts
// 11.7.1 - Dodati photo-editor komponentu ->photo-editor.ts
// 11.8.2 - Importovati ng2-file ->photo-editor.html
// 12.2.1 Importovati reactive forms module ->register.component.html
// 12.8 Dodati BsDatepickerModule u imports ->styles.css
// 13.2.1 Dodati time ago u module
//  14.7.1 Dodati modul za paginaciju PaginationModule ->member-list.ts
// 14.12 Dodati ButtonsModule ->member-list.ts
// 15.7.3 Dodati resolver -lists.componenet..ts
// 16.8.3 Dodati messges reolver u modules ->routes.ts
// 16.10.2 Dodati novu komponentu ->member-messages.ts
// 20.15.1 Dodati admin komponentu ->routes.ts
// 20.17.1 Dodati u hasRole ->hasRole.ts
// 20.18.1 Dodati dvije nove komponente ->admin-panel.html
// 20.18.4 Dodati admin service ->admin.service.ts
// 20.19.1 Dodati role komponentu modal i u entry dodati RolesModalComponent i Modal module ->roles.modal.html
export function tokenGetter() {
    return localStorage.getItem('token');
 }
@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoPipe,
      MemberMessagesComponent,
      AdminPanelComponent,
      HasRoleDirective,
      UserManagmentComponent,
      PhotoManagmentComponent,
      RolesModalComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BsDropdownModule.forRoot(),
      NgxGalleryModule,
      BsDatepickerModule.forRoot(),
      FileUploadModule,
      PaginationModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      ButtonsModule.forRoot(),
      ModalModule.forRoot(),
      JwtModule.forRoot({
         config: {
            // tslint:disable-next-line: object-literal-shorthand
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      })
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      PreventUnsavedChanges,
      ListsResolver,
      MessagesResolver,
      AdminService
   ],
   entryComponents: [
      RolesModalComponent
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
