// env
import { environment } from '../../../environments/environment';

import { Router } from '@angular/router';
import { Component } from '@angular/core';

import { Plugins } from '@capacitor/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage {
    public plans: any = '';
    public filteredPlans: any = '';
    public userPlans: any = '';
    public userActivePlan: any = '';
    public userActualPlan: any = '';
    public selectedFilter1 = true;
    public selectedFilter3 = false;
    public selectedFilter5 = false;
    public selectedFilter6 = false;

    constructor(
        // private storage: Storage,
        private router: Router,
        private http: HttpClient
    ) {}

    customAlertOptions: any = { header: 'Clases' };

    classes: any[] = [
        { name: 'CrossFit' }, { name: 'Frenetic' }
    ];

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

            this.http.get(`${environment.SERVER_URL}/profile/actualplan`, httpOptions)
                .subscribe((result: any) => {
                    this.userActualPlan = result.data;

                    console.log(this.userActualPlan);
            });

            this.http.get(`${environment.SERVER_URL}/plans?all=true`, httpOptions)
                .subscribe((result: any) => {
                    this.plans = result.data;

                    console.log('entre todos los planes');

                    console.log(this.plans);

                    this.filteredPlans = this.plans.filter(
                        plan => (plan.periodId === 1) && (plan.contractable) && (!plan.convenio)
                    );

                    console.log('filtrados:');
                    console.log(this.filteredPlans);
                }
            );
        });
    }

    planFilter(id) {
        switch (id) {
            case 1:
                this.selectedFilter1 = true;

                this.selectedFilter3 = false;

                this.selectedFilter5 = false;

                this.selectedFilter6 = false;

                break;

            case 3:
                this.selectedFilter1 = false;

                this.selectedFilter3 = true;

                this.selectedFilter5 = false;

                this.selectedFilter6 = false;

                break;

            case 5:
                this.selectedFilter1 = false;

                this.selectedFilter3 = false;

                this.selectedFilter5 = true;

                this.selectedFilter6 = false;

                break;

            case 6:
                this.selectedFilter1 = false;

                this.selectedFilter3 = false;

                this.selectedFilter5 = false;

                this.selectedFilter6 = true;

                break;

            default:
        }

        this.filteredPlans = this.plans.filter(
            plan => (plan.periodId === id) && (plan.contractable) && (!plan.convenio)
        );
        // this.selectedFilter1 = true;
    }

    // goToDetail(planId: number) {
    //     this.router.navigate([`/home/tabs/plans/${planId}/details`]);
    // }

    // goToHistorial() {
    //     this.router.navigate(['/home/pay-historial']);
    // }
}
