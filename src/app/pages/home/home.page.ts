import { environment } from '../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition, AnimationStyleMetadata } from '@angular/animations';

import { ModalController, AlertController } from '@ionic/angular';

import {
    Plugins, PushNotificationToken,
    PushNotification, PushNotificationActionPerformed
} from '@capacitor/core';


const { PushNotifications } = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    animations: [
        trigger('animation', [
            state('invisible', style({ height: '0px', 'padding-top': '0', 'padding-bottom': '0'})),

            state('visible', style({ height: '*', 'padding-top': '*', 'padding-bottom': '*'})),

            transition('invisible => visible', animate('0.2s')),

            transition('visible => invisible', animate('0.3s 1.5s'))
        ])
    ],
})
export class HomePage implements OnInit {
    statusConnection = true;
    public animationState = 'invisible'; // Or Enum with visible/invisible.

    constructor(public modalController: ModalController,
                private alertCtrl: AlertController,
                private http: HttpClient) { }

    ngOnInit() {
        this.checkConnection();
        // console.log('i´m here at the home page');

        console.log('Initializing HomePage');

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On success, we should be able to receive notifications
        PushNotifications.addListener('registration', (token: PushNotificationToken) => {
            const pushToken = token.value;
            Plugins.Storage.get({key: 'authData'}).then((authData) => {

                const parsedData = JSON.parse(authData.value) as { token: string };

                const httpOptions = {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${parsedData.token}` // updated
                    })
                };

                this.http.post(`${environment.SERVER_URL}/fcm/token/`,
                               { fcmtoken: pushToken },
                               httpOptions
                ).subscribe((result: any) => {
                        console.log('success to post token');
                    },
                    (err) => {
                        console.log('error to post token');

                        console.log(err);
                    }
                );
            });

            console.log('Push registration success, token: ' + token.value);
        });

        // Some issue with our setup and push will not work
        PushNotifications.addListener('registrationError', (error: any) => {
            alert('Error on registration: ' + JSON.stringify(error));
        });

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
            'pushNotificationReceived', (notification: PushNotification
        ) => {
            console.log('pushNotificationReceived: ' + JSON.stringify(notification));
        });

        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
                const header: any = notification.notification.data.title || 'Notificación';
                const message: any = notification.notification.data.body;

                const data: any = notification.notification.data;

                console.log('data');
                console.log(data);

                console.log('data title');
                console.log(data.title);

                console.log('data body');
                console.log(data.body);

                console.log('header: ' + header, 'message: ' + message);

                if (message) {
                    this.alertCtrl.create({ header, message, buttons: ['Entendido']})
                        .then(alertEl => alertEl.present());
                }

                console.log('Notification data title');
                console.log(notification.notification.data.title);

                console.log('Notification data body');
                console.log(notification.notification.data.body);
            }
        );
    }

    /**
     * Keep listen for status connection change,
     * and show an animation alert if it happens
     *
     * @return void
     */
    async checkConnection() {
        const handler = Plugins.Network.addListener('networkStatusChange', (estado) => {
            if (estado.connected === true) {
                this.statusConnection = true;
                this.animationState = 'invisible';
                console.log(this.animationState);
            }
            if (estado.connected === false) {
                this.statusConnection = false;
                if (this.animationState === 'invisible') {
                    this.animationState = 'visible';
                  }
            }
        });
    }
}
