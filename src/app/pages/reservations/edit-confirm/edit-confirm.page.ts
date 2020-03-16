// env
import { environment } from '../../../../environments/environment';

import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Platform, ModalController, IonInfiniteScroll, LoadingController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

import { ConfirmPage } from '../confirm/confirm.page';
import { ImageModalPage } from '../../../shared/image-modal/image-modal.page';
import { myEnterAnimation } from '../../../shared/image-modal/animations/enter';
import { myLeaveAnimation } from '../../../shared/image-modal/animations/leave';

@Component({
    selector: 'app-edit-confirm',
    templateUrl: './edit-confirm.page.html',
    styleUrls: ['./edit-confirm.page.scss'],
})
export class EditConfirmPage {
    @ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll;

    public clase: any = [];
    public reservations: any = [];
    public page = 1;

    buttonFixIOS: string;
    buttonFixAndroid: string;
    value: string;
    title: string;
    message: string;
    buttonIcon: string;
    httpOptions: any;
    reservationUrl: string;
    haymodal = false;
    actualModal: any;
    varIsPressed = false;

    constructor( public plt: Platform,
                 private modalController: ModalController,
                 private router: Router,
                 private http: HttpClient,
                 public activatedRoute: ActivatedRoute,
                 private loadingController: LoadingController
               ) {}

    ionViewDidEnter() {
        this.page = 1;
        if (this.plt.is('ios')) {
            // Si es iOS
            this.buttonFixIOS = 'button-fix-ios';

            this.buttonFixAndroid = 'display-none';
        } else {
            // Si es Android
            this.buttonFixIOS = 'display-none';

            this.buttonFixAndroid = 'button-fix';
        }

        console.log('hola entre a la clase para editar');

        this.retrieveClase();
    }

    async retrieveClase() {
        const loading = await this.loadingController.create({
            spinner: 'crescent'
        });

        loading.present().then(() => {
            const id = this.activatedRoute.snapshot.paramMap.get('wodId');

            console.log(this.activatedRoute);
            console.log(this.activatedRoute.snapshot.paramMap);
            console.log('sii');

            Plugins.Storage.get({ key: 'authData' }).then((authData) => {
                const parsedData = JSON.parse(authData.value) as {
                    token: string
                };
                this.httpOptions = {
                    headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
                };

                this.http.get(`${environment.SERVER_URL}/clases/${id}`, this.httpOptions)
                    .subscribe((result: any) => {
                        console.log(' http entre a la clase para editar');
                        this.clase = result.data;
                        console.log(this.clase);
                        this.reservationUrl = this.clase.rels.reservations.href;
                        this.loadUsers();
                        loading.dismiss();
                    }
                );
            });
        });
    }

    // primeros 10 usuarios
    loadUsers() {
        console.log('cargando usuarios');

        this.http.get(`${this.reservationUrl}?page=${this.page}`, this.httpOptions)
            .subscribe((result: any) => {
                this.reservations = result.data;

                console.log(this.reservations);

                this.page++;
            }
        );
    }

    // cargando usuarios por infinit loader
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
    }

    async openModal() {
        const modal = await this.modalController.create({
            component: ConfirmPage,
            componentProps: {
                custom_id: 1,
                title: 'Confirmar esta clase',
                message: `${this.clase.dateHuman} de ${this.clase.start} a ${this.clase.end}hrs. No podras cancelar esta accion`,
                buttonIcon: '/assets/icon/info.svg',
                claseId: this.clase.clase_id,
                buttonActionConfirm: true,
            },
            cssClass: 'modal-confirm'
        });

        return await modal.present();
    }

    async openModalCeder() {
        const modal = await this.modalController.create({
            component: ConfirmPage,
            componentProps: {
                custom_id: 0,
                title: 'Ceder tu Cupo',
                message: 'Si cedes tu cupo podrás reservar en otro horario',
                buttonIcon: '/assets/icon/info.svg',
                claseId: this.clase.clase_id,
                buttonActionRemove: true,
            },
            cssClass: 'modal-confirm'
        });
        return await modal.present();
    }

    goToEditHour(date = '2015-01-01') {
        this.router.navigate( [`/home/edit-hour/${date}`] );
    }

    async imageClick(avatar) {
        const imgurl = avatar;
        const modal = await this.modalController.create({
            component: ImageModalPage,
            componentProps: {
                title: 'imagen',
                img: imgurl,
            },
            cssClass: 'modal-confirm'
        });
        modal.onDidDismiss().then(data => {
            console.log('cerre image modal');
            console.log(data);
        });

        return await modal.present();
    }
}
