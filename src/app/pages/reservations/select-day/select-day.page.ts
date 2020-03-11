// ENV
import { environment } from '../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-select-day',
  templateUrl: './select-day.page.html',
  styleUrls: ['./select-day.page.scss'],
})
export class SelectDayPage  {
    public week: any = [];

    constructor( private storage: Storage,
                 private router: Router,
                 private http: HttpClient,
                 public activatedRoute: ActivatedRoute,
                 public loadingController: LoadingController
                ) { }

    ionViewDidEnter() {
        this.weekLoader();
    }

    /**
     * Show loading while retrieve the week's classes
     *
     * @return void
     */
    async weekLoader() {
        const loading = await this.loadingController.create({
            message: 'Cargando semana...',
        });
        loading.present().then(() => {
            Plugins.Storage.get({ key: 'authData' }).then((authData) => {
                const clasetype = this.activatedRoute.snapshot.paramMap.get('claseTypeId');

                const parsedData = JSON.parse(authData.value) as {
                    token: string
                };
                const httpOptions = {
                    headers: new HttpHeaders({ Authorization: `Bearer ${parsedData.token}` })
                };

                this.http.get(`${environment.SERVER_URL}/week/${clasetype}`, httpOptions)
                    .subscribe((result: any) => {
                        console.log('entre a las weeks');

                        this.week = result.data;

                        console.log(this.week);

                        loading.dismiss();
                    });
                }
            );
        });
    }



    goToAddHour(date: string = '2015-01-01', has: boolean = false ) {
        console.log(has);

        if (has) {
            const claseTypeId = this.activatedRoute.snapshot.paramMap.get('claseTypeId');

            this.router.navigateByUrl(
                `/home/tabs/clases/clase-type/${claseTypeId}/select-day/${date}`
            );
        }
    }
}
