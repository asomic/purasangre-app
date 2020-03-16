// env
import { environment } from '../../../../environments/environment';

import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ModalController, ToastController  } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage {
    claseId: any;
    buttonIcon: any;
    title: any;
    message: any;
    buttonActionAdd: any;
    buttonActionRemove: any;
    buttonActionConfirm: any;
    disabled =  false;

     constructor( public viewCtrl: ModalController,
                  private http: HttpClient,
                  private router: Router,
                  public toastController: ToastController
               ) { }

    async presentToast(message: string) {
        const toast = await this.toastController.create({
             message, duration: 2500, position: 'top'
        });

        toast.present();
    }

    reserve( id: string ) {
        this.disabled = true;
        Plugins.Storage.get({ key: 'authData' }).then((authData) => {
            const parsedData = JSON.parse(authData.value) as {
                token: string
            };
            const httpOptions = {
                headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
            };

            console.log(id);

            this.http.post(environment.SERVER_URL + '/clases/' + id + '/reserve', null, httpOptions)
                .subscribe((result: any) => {
                    console.log('voy a reservar...');

                    this.viewCtrl.dismiss();

                    this.router.navigateByUrl('/home/tabs/clases');

                    this.presentToast('Clase Reservada');
                },
            err => {
                console.log(err);
                console.log('aqui estoy');

                this.viewCtrl.dismiss();
                this.presentToast('No es posible reservar esta clase');
            });
        });
    }

    remove(id: string ) {
        this.disabled = true;
        Plugins.Storage.get({ key: 'authData' }).then((authData) => {
            const parsedData = JSON.parse(authData.value) as {
                token: string
            };

            const httpOptions = {
                headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
            };

            console.log(id);

            this.http.post(environment.SERVER_URL + '/clases/' + id + '/remove', null, httpOptions)
                .subscribe((result: any) => {
                 // console.log('voy a remover...');
                this.viewCtrl.dismiss();
                this.router.navigateByUrl('/home/tabs/clases');
                this.presentToast('Has cedido tu cupo, ahora puedes reservar otra hora');
            },
            err => {
                // console.log('error 401');
                console.log(err);
                this.viewCtrl.dismiss();
            });
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    confirm(id: string ) {
        this.disabled = true;

        console.log('click confirm');

        Plugins.Storage.get({ key: 'authData' }).then((authData) => {
            const parsedData = JSON.parse(authData.value) as {
                token: string
            };
            const httpOptions = {
                headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
            };

            this.http.post(`${environment.SERVER_URL}/clases/${id}/confirm`, null, httpOptions)
                .subscribe((result: any) => {
                    // console.log('voy a confirnar clase...');
                    this.viewCtrl.dismiss();

                    this.router.navigateByUrl('/home/tabs/clases');

                    this.presentToast('Reserva Confirmada');
            },
            err => {
                console.log('error 401');

                console.log(err);

                this.viewCtrl.dismiss();
            });
        });
    }
}
