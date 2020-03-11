// env
import { environment } from '../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

import { Plugins } from '@capacitor/core';

@Component({
    selector: 'app-pago-detail',
    templateUrl: './plan-detail.page.html',
    styleUrls: ['./plan-detail.page.scss'],
})
export class PlanDetailPage implements OnInit {
    buttonFixIOS: string;
    buttonFixAndroid: string;
    plan: any;
    dates: any;

    constructor(
        public activatedRoute: ActivatedRoute,
        private plt: Platform,
        private http: HttpClient,
        private router: Router
    ) {
        if (this.plt.is('ios')) {
            console.log('es ios');
            // Si es iOS

            this.buttonFixIOS = 'button-fix-ios';

            this.buttonFixAndroid = 'display-none';
        } else {
            console.log('es android');
            // Si es Android

            this.buttonFixIOS = 'display-none';

            this.buttonFixAndroid = 'button-fix';
        }
    }

    ngOnInit() { }

    ionViewDidEnter() {
        const id = this.activatedRoute.snapshot.paramMap.get('planId');
        console.log(this.activatedRoute.snapshot.paramMap);
        Plugins.Storage.get({ key: 'authData' }).then((authData) => {

            const parsedData = JSON.parse(authData.value) as {
                token: string
            };

            const httpOptions = {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${parsedData.token}` // updated
                })
            };

            console.log(id);

            this.http.get(`${environment.SERVER_URL}/plans/${id}`, httpOptions)
                .subscribe((result: any) => {
                    console.log(result.data);

                    this.plan = result.data;
                }
            );

            this.http.get(`${environment.SERVER_URL}/plans/${id}/dates`, httpOptions)
                .subscribe((result: any) => {
                    console.log(result);

                    this.dates = result;
                }
            );
        });
    }

    contract(planId: number) {
        this.router.navigate([`/home/tabs/plans/${planId}/flow`]);
        // console.log(id);
    }
}
