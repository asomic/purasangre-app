import { environment } from '../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition, AnimationStyleMetadata } from '@angular/animations';

import { ModalController, AlertController, Platform, ToastController } from '@ionic/angular';
import { FCM } from "capacitor-fcm";

import {
    Plugins,
    PushNotificationToken,
    PushNotification,
    PushNotificationActionPerformed
} from '@capacitor/core';


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
    hasNotifications:boolean;
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
        let token:any; 
        // console.log('i´m here at the home page');

        console.log('Initializing HomePage');
        PushNotifications.addListener('registration', data => {
            console.log('hola este es mi fcm: '+data.value);
            token = data.value;
          });
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register().then(() => {

            fcm.getToken().then(
                result=> {
                  let remoteToken = result.token;
                  console.log('ahora si po puto: '+remoteToken);
                  Plugins.Storage.get({key: 'authData'}).then((authData) => {
                      const parsedData = JSON.parse(authData.value) as { token: string };
                      const httpOptions = {
                          headers: new HttpHeaders({
                              Authorization: `Bearer ${parsedData.token}` // updated
                          })
  
                      };
                  this.http.post(`${environment.SERVER_URL}/fcm/token/`,
                                 { fcmtoken: remoteToken },
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
                }
            ).catch(err => {
              console.log('que chucha!!!!');
              console.log(err);
            });

        });
        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
            'pushNotificationReceived', (notification: PushNotification
        ) => {
            console.log('pushNotificationReceived: ' + JSON.stringify(notification));
            const header: any = notification.title;
            const message: any = notification.body;
            this.alertCtrl.create({ header, message, buttons: ['Entendido']})
            .then(alertEl => alertEl.present());
        });
        
        // Method called when tapping on a notification
        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification: PushNotificationActionPerformed) => {

                const data: any = notification.notification.data;

                
                console.log('data');
                console.log(data);
                console.log('data message');
                console.log(data.message);
                const parsed: any = JSON.parse(notification.notification.data.message);
                const header: any = parsed.title || 'Notificación';
                const message: any =  parsed.body
                console.log(JSON.parse(data.message));

                console.log('data title');
                console.log(header);
                console.log('data body');
                console.log(message);
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
        //pushNotificationReceived
        // PushNotifications.addListener(
        //     'pushNotificationReceived',
        //     (notification: PushNotification) => {
        //       console.log('notification recived' + JSON.stringify(notification));
        //       console.log('pushNotificationReceived');
        //       alert('Push action performed: ' + JSON.stringify(notification));
        //       this.notifications.push(notification);
        //       console.log(this.notifications);
        //       this.pushToast(notification.title,notification.body);
        //     }
        //   );

        // PushNotifications.getDeliveredNotifications().then(result =>{
        //     console.log('getDeliveredNotifications');
        //     console.log(result);
        //    // this.notifications.push(result);
        // });  
        
        // PushNotifications.addListener('pushNotificationActionPerformed', 
        // (   notification ) => {
        //         console.log('notification performed tap ' + JSON.stringify(notification));
        //         console.log('PushNotificationActionPerformed');
        //         console.log('titulo');
        //         console.log(notification);
        //         console.log(notification.inputValue.valueOf);
        //         console.log(notification.actionId);
        //         console.log(notification.notification);
        //         console.log('lista');
        //         console.log(this.notifications);
        //         alert('Push action performed: ' + JSON.stringify(notification.notification));
        //         this.notifications.forEach(not => {
        //             //this.pushToast(notification.notification.title,notification.notification.body);
        //             this.pushToast(not.title,not.body);
        //         })
                
                
        //     }
        // );  

        


        // On success, we should be able to receive notifications
        // PushNotifications.addListener('registration', (token: PushNotificationToken) => {
        //     const pushToken = token.value;
        //     Plugins.Storage.get({key: 'authData'}).then((authData) => {

        //         const parsedData = JSON.parse(authData.value) as { token: string };

        //         const httpOptions = {
        //             headers: new HttpHeaders({
        //                 Authorization: `Bearer ${parsedData.token}` // updated
        //             })
        //         };

        //         this.http.post(`${environment.SERVER_URL}/fcm/token/`,
        //                        { fcmtoken: pushToken },
        //                        httpOptions
        //         ).subscribe((result: any) => {
        //                 console.log('success to post token');
        //             },
        //             (err) => {
        //                 console.log('error to post token');

        //                 console.log(err);
        //             }
        //         );
        //     });

        //     console.log('Push registration success, token: ' + token.value);
        // });

        // Some issue with our setup and push will not work
        // PushNotifications.addListener('registrationError', (error: any) => {
        //     alert('Error on registration: ' + JSON.stringify(error));
        // });
        // Show us the notification payload if the app is open on our device
        // PushNotifications.addListener('pushNotificationReceived', 
        // (notification: PushNotification) => {
        //     console.log('pushNotificationReceived');
        //     console.log(notification);
        //     this.pushToast(notification.title,notification.body);
        // }
        // );

        // // Method called when tapping on a notification
        // PushNotifications.addListener('pushNotificationActionPerformed', 
        // (notification: PushNotificationActionPerformed) => {
        //     console.log('PushNotificationActionPerformed');
        //     console.log(notification);
            
        // }
        // );
        // Show us the notification payload if the app is open on our device
        // PushNotifications.addListener(
        //     'pushNotificationReceived', (notification: PushNotification
        // ) => {
        //     console.log('pushNotificationReceived: ' + JSON.stringify(notification));
        // });

        // Method called when tapping on a notification
        // PushNotifications.addListener('pushNotificationActionPerformed',
        //     (notification: PushNotificationActionPerformed) => {
        //         const header: any = notification.notification.data.title || 'Notificación';
        //         const message: any = notification.notification.data.body;

        //         const data: any = notification.notification.data;
        //         console.log('notificacion');
        //         console.log(notification);

        //         console.log('data');
        //         console.log(data);

        //         console.log('data title');
        //         console.log(data.title);

        //         console.log('data body');
        //         console.log(data.body);

        //         console.log('header: ' + header, 'message: ' + message);

        //         if (message) {
        //             this.alertCtrl.create({ header, message, buttons: ['Entendido']})
        //                 .then(alertEl => alertEl.present());
        //         }

        //         console.log('Notification data title');
        //         console.log(notification.notification.data.title);

        //         console.log('Notification data body');
        //         console.log(notification.notification.data.body);
        //     }
        // );
    }

    async pushToast(title:any,message:any) {
        const toast = await this.toastCtl.create({
          header: title,
          message: message,
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
          if(this.location.isCurrentPathEqualTo('/home/tabs/dashboard') || this.location.isCurrentPathEqualTo(''))
          {
            navigator['app'].exitApp();
          } else {
            this.location.back();
          }
        });
      }
}
