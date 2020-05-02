// Dodati rute i classu za rute ->app.module.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
// 7.5.2 Dodati guard na memberlist
// 7.6 Dodati guard na grupu ruta
// 9.10.2 Dodati rutu za memberdetail komponentu ->member-detail.html
// 9.13.2 Dodati resolver -> member-detail.ts
// 10.2.2 Dodati rutu za member-edit -nav.html
// 10.2.6 Dodati resolver -> member-edit.ts
// 10.5.2 Dodati PreventUnsavedChanges guard ->messages.componenet.ts
// 20.15.2 Dodati komponentu -> nav.component.html
export const appRoutes: Routes = [
    {path: 'home', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            {path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            // tslint:disable-next-line: max-line-length
            {path: 'member/edit', component: MemberEditComponent, resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
            // 16.8.4 Dodati resolver na rutu
            {path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}},
            // 15.7.2 Dodati resolver na rutu -app.module.ts
            {path: 'lists', component: ListsComponent, resolve: {users: ListsResolver}},
            // 20.15.2
            // 20.16.1 dodatikoje role prolaze na ovu rutu ->auth.guard
            {path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}},
        ]
    },
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
