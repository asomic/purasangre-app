import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.page.html',
  styleUrls: ['./image-modal.page.scss'],
})
export class ImageModalPage implements OnInit {
    img: any;
    user: any;

    sliderOpts = { zoom: { maxRatio: 2 } };

    constructor(private navParams: NavParams) { }

    ngOnInit() {
        this.img = this.navParams.get('img');

        this.user = `${this.navParams.get('firstName')} ${this.navParams.get('lastName')}`;
    }
}
