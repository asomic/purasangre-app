import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { SharedModule } from '../../shared/shared.module';
import { HomePageRoutingModule } from './home-routing.module';
import { AlertPushModalPage } from './modals/alert-push-modal/alert-push-modal.page';
import { AlertPushModalPageModule } from './modals/alert-push-modal/alert-push-modal.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        SharedModule,
        AlertPushModalPageModule
    ],
    declarations: [HomePage, AlertPushModalPage]
})
export class HomePageModule {}
