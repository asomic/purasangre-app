import { environment } from '../../../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
    public plans: any = '';

    constructor(
        private storage: Storage,
        private http: HttpClient
    ) { }

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
        Plugins.Storage.get({key: 'authData'}).then((authData) => {
            const parsedData = JSON.parse(authData.value) as {
                token: string
            };

            const httpOptions = {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${parsedData.token}` // updated
                })
            };

            this.http.get(`${environment.SERVER_URL}/profile/plans`, httpOptions)
                .subscribe((result: any) => {
                    console.log(result.data);
                    this.plans = result.data;
                }
            );
        });
    }

    ngOnInit() { }
}
