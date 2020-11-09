import { environment } from '../../../environments/environment';

import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { FCM } from 'capacitor-fcm';

import { ModalController, AlertController, Platform, ToastController } from '@ionic/angular';

import {
    Plugins,
    PushNotificationToken,
    PushNotification,
    PushNotificationActionPerformed,
    Capacitor
} from '@capacitor/core';

import { AlertPushModalPage } from './modals/alert-push-modal/alert-push-modal.page';


const { PushNotifications } = Plugins;
const fcm = new FCM();

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
    hasNotifications: boolean;
    notifications: PushNotification[] = [];
    constructor(
        public modalController: ModalController,
        private alertCtrl: AlertController,
        private http: HttpClient,
        public platform: Platform,
        private location: Location,
        private toastCtl: ToastController

    ) { }

    
    ngOnInit() {
        this.backButtonEvent();
        this.checkConnection();
        let token: any;
        // console.log('i´m here at the home page');
        
        console.log('Inicializando Home');
        
        // initPush() {
        //     if (Capacitor.platform !== 'web') {
        //         this.registerPush();
        //     }
        // }

        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        PushNotifications.requestPermission().then( result => {
            if (result.granted) {
                PushNotifications.register();
            } else {

            }
        } )

        // On success, we should be able to receive notifications
        PushNotifications.addListener(
            'registration', 
            (token: PushNotificationToken) => {
                console.log('Push registration exitoso, token: ' + token.value);
            }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener(
            'registrationError',
            (error: any) => {
                console.log('Error al registrarse: ' + JSON.stringify(error));
            }
        );

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotification) => {
                console.log('Push recibido: ' + JSON.stringify(notification));
                // alert('Push received: ' + JSON.stringify(notification));
                // const header: any = notification.title;
                // const message: any = notification.body;
                // this.openModal(header, message);
            }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
                // alert('Push action performed: ' + JSON.stringify(notification));
                // const data: any = notification.notification.data;
                // console.log(data);
                // this.openModal(data.title, data.body);
            }
        );
    }

    async pushToast(title: any, message: any) {
        const toast = await this.toastCtl.create({
          header: title,
          message,
          buttons: [
            {
              text: 'Cerrar',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        });
        toast.present();
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

    backButtonEvent(): void {
        const sub = this.platform.backButton.subscribeWithPriority(9999, () => {
            if (this.location.isCurrentPathEqualTo('/home/tabs/dashboard') ||
                this.location.isCurrentPathEqualTo('')) {
                navigator['app'].exitApp();
            } else {
                this.location.back();
            }
        });
    }

    /**
     *  [openModal description]
     *
     *  @param   string  Push notification title
     *  @param   string  Push notification body
     *
     *  @return  Modal
     */
    async openModal(title: string, body: string) {
        const modal = await this.modalController.create({
            component: AlertPushModalPage,
            componentProps: {
                title, body, buttonIcon: '/assets/icon/info.svg',
            },
            cssClass: 'modal-confirm'
        });

        return await modal.present();
    }
}
