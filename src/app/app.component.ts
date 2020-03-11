import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';

import { Plugins, Capacitor } from '@capacitor/core';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(private platform: Platform) {
        this.initializeApp();
    }

    /**
     * [initializeApp description]
     *
     * @return void
     */
    initializeApp() {
        this.platform.ready().then(() => {
            if (Capacitor.isPluginAvailable('SplashScreen')) {
                Plugins.SplashScreen.hide({ fadeOutDuration: 500 });
            }
        });
    }

    // private notificationSetup() {
    //     this.fcm.getToken();
    //     this.fcm.onNotifications().subscribe(
    //         (msg) => {
    //         if (this.platform.is('ios')) {
    //             this.bodyText = JSON.stringify(msg.aps.alert.body);
    //             this.presentToast(this.bodyText.replace(/\"/g, ''));
    //             // this.mensajito = msg;
    //         } else {
    //             this.presentToast(msg.body);
    //         }
    //     });
    // }
}
