import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-alert-push-modal',
  templateUrl: './alert-push-modal.page.html',
  styleUrls: ['./alert-push-modal.page.scss'],
})

export class AlertPushModalPage implements OnInit {
    title: string;
    body: string;

    constructor(public viewCtrl: ModalController) { }

    ngOnInit() { }

    /**
     *  [closeModal description]
     *
     *  @return  void
     */
    closeModal() {
        this.viewCtrl.dismiss();
    }
}
