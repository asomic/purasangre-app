import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditConfirmPage } from './edit-confirm.page';
import { SharedModule } from '../../../shared/shared.module';
import { LongPressModule } from 'ionic-long-press';

const routes: Routes = [
    {
        path: '',
        component: EditConfirmPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        SharedModule,
        LongPressModule
    ],
    declarations: [ EditConfirmPage ]
})
export class EditConfirmPageModule {}
