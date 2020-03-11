// environment
import { environment } from '../../../../environments/environment';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component  } from '@angular/core';

import { Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-clases-today',
    templateUrl: './clases-today.page.html',
    styleUrls: [ './clases-today.page.scss' ],
})
export class ClasesTodayPage {
    public today: any = '';

    constructor(private http: HttpClient,
                private loadingController: LoadingController) { }

    // Refresh
    doRefresh(event) {
        console.log('Begin async operation');

        this.ionViewDidEnter();

        setTimeout(() => {
            console.log('Async operation has ended');

            event.target.complete();
        }, 2000);
    }

    ionViewDidEnter() {
        this.retrieveTodayWods();
    }

    async retrieveTodayWods() {
        const loading = await this.loadingController.create({
            spinner: 'crescent'
        });

        loading.present().then(() => {
            Plugins.Storage.get({ key: 'authData' }).then((authData) => {
                const parsedData = JSON.parse(authData.value) as {
                    token: string
                };
                const httpOptions = {
                    headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
                };

                this.http.get(`${ environment.SERVER_URL }/today`, httpOptions)
                .subscribe((result: any) => {
                    this.today = result.data;
                    loading.dismiss();
                });
            });
        });
    }
}
