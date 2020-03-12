// env
import { environment } from '../../../../environments/environment';

import { ActivatedRoute } from '@angular/router';
import { Component, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IonInfiniteScroll, LoadingController } from '@ionic/angular';
import { Platform, ModalController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

import { ConfirmPage } from '../confirm/confirm.page';
import { ImageModalPage } from '../../../shared/image-modal/image-modal.page';
import { myEnterAnimation } from '../../../shared/image-modal/animations/enter';
import { myLeaveAnimation } from '../../../shared/image-modal/animations/leave';

@Component({
    selector: 'app-add-confirm',
    templateUrl: './add-confirm.page.html',
    styleUrls: ['./add-confirm.page.scss'],
})
export class AddConfirmPage  {
    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

    public clase: any = [];
    public users: any = [];
    public reservations: any = [];
    public page = 1;

    buttonFixIOS: string;
    buttonFixAndroid: string;
    title;
    message;
    buttonIcon;
    buttonAction;
    httpOptions;
    reservationUrl;
    haymodal = false;
    actualModal: any;
    varIsPressed = false;

    constructor(public plt: Platform,
                private modalController: ModalController,
                private http: HttpClient,
                public activatedRoute: ActivatedRoute,
                public loadingController: LoadingController
               ) {
        if (this.plt.is('ios')) {
            // Si es iOS
            this.buttonFixIOS = 'button-fix-ios';

            this.buttonFixAndroid = 'display-none';
        } else {
            // Si es Android
            this.buttonFixIOS = 'display-none';

            this.buttonFixAndroid = 'button-fix';
        }
    }

    async openModal() {
        const modal = await this.modalController.create({
            component: ConfirmPage,
            componentProps: {
                title: 'Reservar esta hora',
                message: this.clase.dateHuman + ' de ' + this.clase.start +
                         ' a ' + this.clase.end + 'hrs',
                buttonIcon: '/assets/icon/info.svg',
                claseId: this.clase.clase_id,
                buttonActionAdd: true,
            },
            cssClass: 'modal-confirm'
        });
        // this.title = modal.componentProps.title;
        // this.message = modal.componentProps.message;
        // this.buttonIcon = modal.componentProps.buttonIcon;
        return await modal.present();
    }

    ionViewDidEnter() {
        this.page = 1;

        this.retrieveClase();
    }

    async retrieveClase() {
        const loading = await this.loadingController.create({
            spinner: 'crescent'
        });

        loading.present().then(() => {
            const id = this.activatedRoute.snapshot.paramMap.get('claseId');

            Plugins.Storage.get({ key: 'authData' }).then((authData) => {
                const parsedData = JSON.parse(authData.value) as {
                    token: string
                };

                this.httpOptions = {
                    headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
                };

                this.http.get(`${environment.SERVER_URL}/clases/${id}`, this.httpOptions)
                    .subscribe((result: any) => {
                        this.clase = result.data;

                        console.log(this.clase);

                        this.reservationUrl = this.clase.rels.reservations.href;

                        this.loadUsers();

                        loading.dismiss();
                    }
                );
            });



            // const id = this.activatedRoute.snapshot.paramMap.get('wodId');

            // console.log(this.activatedRoute);
            // console.log(this.activatedRoute.snapshot.paramMap);
            // console.log('sii');

            // Plugins.Storage.get({ key: 'authData' }).then((authData) => {
            //     const parsedData = JSON.parse(authData.value) as {
            //         token: string
            //     };
            //     this.httpOptions = {
            //         headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
            //     };

            //     this.http.get(`${environment.SERVER_URL}/clases/${id}`, this.httpOptions)
            //         .subscribe((result: any) => {
            //             console.log(' http entre a la clase para editar');
            //             this.clase = result.data;
            //             console.log(this.clase);
            //             this.reservationUrl = this.clase.rels.reservations.href;
            //             this.loadUsers();
            //             loading.dismiss();
            //         }
            //     );
            // });
        });
    }

    // primeros 10 usuarios
    loadUsers() {
        console.log('cargando usuarios');
        this.http.get(`${this.reservationUrl}?page=${this.page}`, this.httpOptions)
            .subscribe((result: any) => {
                console.log(result);
                this.reservations = result.data;

                console.log(this.reservations);

                this.page++;
            }
        );
    }

    // Cargando usuarios por infinit loader
    loadMoreUsers(infiniteScrollEvent) {
        this.http.get(`${this.reservationUrl}?page=${this.page}`, this.httpOptions)
            .subscribe((result: any) => {
                console.log('mas users agregados');

                this.reservations = this.reservations.concat(result.data);

                console.log(this.reservations);

                this.page++;

                infiniteScrollEvent.target.complete();
            }
        );
        // this.days = this.days.concat(response.data.data);
        // event.target.complete();
    }

    // image popup
    openPreview(img) {
        this.modalController.create({
            component: ImageModalPage,
            componentProps: { img }
        }).then(modal => {
            modal.present();
        });
    }

    /**
     * Open Modal for Image Avatar view
     *
     * img, firstName, lastName
     */
    beingLongPressed(img: any, firstName: any, lastName: any) {
        // console.log('beingLongPressed');
        if (!this.haymodal) {
            this.modalController.create({
                component: ImageModalPage,
                componentProps: { img, firstName, lastName },
                cssClass: 'background-color-modal',
                enterAnimation: myEnterAnimation,
                leaveAnimation: myLeaveAnimation
            }).then(modal => {
                this.actualModal = modal;
                this.haymodal = true;
                modal.present().then();
            });
        }
    }

    /**
     * Close Modal for Image Avatar view, and return color to icon image avatar
     *
     * img, firstName, lastName
     */
    finishLongPress() {
        if (this.haymodal) {
            this.actualModal.dismiss().then(() => {
                this.actualModal = null;
                this.haymodal = false;
                this.varIsPressed = false;
            });
        }
    }

    
    clicked() {
        this.varIsPressed = true;
        setTimeout(() => {
            this.varIsPressed = false;
        }, 500);
        // setInterval(() => { console.log('hola'); }, 4000);
    }
}
