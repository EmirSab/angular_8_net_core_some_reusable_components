import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

// 10.5 Dodati guard kada krene sa edit stranice da ga mu kaze da nije spasio ->app.module.ts
@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Spasio nisi jesi siguran da zelis nastaviti');
        }
        return true;
    }
}
