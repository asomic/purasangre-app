import { environment } from '../../../../environments/environment';

import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Plugins } from '@capacitor/core';

@Component({
    selector: 'app-flow',
    templateUrl: './flow.page.html',
    styleUrls: ['./flow.page.scss'],
})
export class FlowPage implements OnInit {
    public loading = true;
    public loaded = false;
    public progress: number;
    public url: string;
    public html: any;

    constructor(
        public activatedRoute: ActivatedRoute,
        public platform: Platform,
        public zone: NgZone,
        public storage: Storage,
        public http: HttpClient,
        public route: Router,
        private iab: InAppBrowser,
    ) { }

    ngOnInit() { }

    ionViewDidEnter() {
        this.loaded = false;
        this.loading = true;
        const id = this.activatedRoute.snapshot.paramMap.get('planId');
        console.log(id);
        Plugins.Storage.get({key: 'authData'}).then((authData) => {

            const parsedData = JSON.parse(authData.value) as {
                token: string
            };

            const httpOptions = {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${parsedData.token}` // updated
                })
            };

            this.http.get(`${environment.SERVER_URL}/plans/${id}/contract`, httpOptions)
                .subscribe((result: any) => {
                    console.log(result.data);

                    this.http.get(`${environment.SERVER_URL}/flow/${result.data.id}`, httpOptions)
                        .subscribe((flowresult: any) => {
                            console.log('url flow');
                            console.log(flowresult.url);

                            // this.navigateFlow(flowresult.url);

                            if (this.platform.is('android')) {
                                const browser = this.iab.create(
                                    flowresult.url, '_blank',
                                    `hideurlbar=yes,footer=no,toolbarcolor=#141A29,
                                    navigationbuttoncolor=#D3D5E0,closebuttoncaption=cerrar,
                                    closebuttoncolor=#D3D5E0`
                                );

                                browser.on('loadstop').subscribe((event) => {
                                  console.log('cargo android');
                                });

                                browser.on('exit').subscribe((event) => {
                                    this.zone.run(async () => {
                                        await this.route.navigate([`/plans/${id}`]);
                                    });

                                    browser.close();
                                });
                            }

                            if (this.platform.is('ios')) {
                                const browser = this.iab.create(
                                    flowresult.url,
                                    '_blank',
                                    `toolbarposition=top,closebuttoncaption=Cerrar,
                                    toolbarcolor=#141A29,closebuttoncolor=#D3D5E0,
                                    navigationbuttoncolor=#D3D5E0`
                                );

                                browser.on('loadstop').subscribe((event) => {
                                  console.log('cargo ios');
                                });

                                browser.on('exit').subscribe((event) => {
                                    this.zone.run(async () => {
                                        await this.route.navigate([`/plans/${id}`]);
                                    });

                                    browser.close();
                                });
                            }
                        }
                    );
                }
            );
        });
    }

    async navigateFlow(url) {
        console.log('en navigateFlow');
        await Plugins.Browser.open({ url }).then(page => {
            console.log(page);
        });
    }
}
