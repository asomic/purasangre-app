import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular';
import { AnimationOptions } from '@ionic/angular/dist/providers/nav-controller';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnDestroy {
    @Input() urltoBack: string;

    @Input() titulo: string;

    @Input() avatar: string;

    // mainTabs = ['Dashboard', 'Tus Clases', 'Planes'];

    ngOnDestroy() { }

    constructor(private location: Location,
                private navCtrl: NavController) {}

    // backUrl() {
    //     this.location.back();
    // }

    goBackUrl() {
        const animations: AnimationOptions = {
            animated: true,
            animationDirection: 'back'
        };
        this.navCtrl.back(animations);
    }
}
