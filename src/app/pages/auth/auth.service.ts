import { environment } from '../../../environments/environment';

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { Storage } from '@ionic/storage';

import { Plugins } from '@capacitor/core';

import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { User } from '../../models/users/user.model';
import { ProfileService } from '../profile/profile.service';
import { LoadingController } from '@ionic/angular';

const TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN = 'refresh-token';

export interface AuthResponseData {
    email: string;
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    // tslint:disable-next-line: variable-name
    private _user = new BehaviorSubject<User>(null);

    authenticationState = new BehaviorSubject(false);

    /**
     * check with the user model if user is authenticated,
     * checkin the token
     *
     * @return  boolean
     */
    get userIsAuthenticated() {
        return this._user.asObservable().pipe(map(user => {
            if (user) {
                // the !! forces to response like a boolean
                return !!user.token;
            }

            return false;
        }));
    }

    constructor(
        private http: HttpClient,
        private profileService: ProfileService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) { }

    autoLogin() {
        return from(Plugins.Storage.get({ key: 'authData' })).pipe(
            map(storeData => {
                // console.log(storeData);
                if (!storeData || !storeData.value) {
                    console.log('!storeData');
                    return null;
                }

                const parsedData = JSON.parse(storeData.value) as {
                    email: string,
                    tokenType: string,
                    token: string,
                    refreshToken: string,
                    tokenExpirationDate: string
                };

                const expirationTime = new Date(parsedData.tokenExpirationDate);

                if (expirationTime <= new Date()) {
                    return null;
                }
                const user = new User(
                    parsedData.email,
                    parsedData.tokenType,
                    parsedData.token,
                    parsedData.refreshToken,
                    expirationTime,
                );
                return user;
            }),
            tap(user => {
                if (user) {
                    this._user.next(user);
                }
            }),
            map(user => {
                return !!user;
            })
        );
    }

    login(email, password) {
        // console.log(email, password);
        const data = JSON.stringify({
            username: email,
            password,
            grant_type: 'password',
            client_id: 2,
            client_secret: environment.purasangreAPIKey,
        });

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };

        return this.http.post<AuthResponseData>(
                `${environment.SERVER_URL}/oauth/token`, data, httpOptions
            ).pipe(tap(this.setUserData.bind(this, email)));
    }

    logout() {
        this.loadingCtrl.create({ keyboardClose: true, message: 'Cerrando Sesión...', spinner: 'crescent'})
            .then(loadingEl => {
                // Load modal
                loadingEl.present();
                // Make the login
                const res = this.getOut();

                console.log('el res es ' + res);

                if (res == null) {
                    this.router.navigateByUrl('/auth');

                    loadingEl.dismiss();
                }
            }
        );
    }

    /**
     * Clean all the data storage in the App
     *
     * @return  null
     */
    getOut() {
        Plugins.Storage.clear();

        this.profileService.nullProfile();

        return this._user.next(null);
    }

    private setUserData(email, userData: AuthResponseData) {
        const expirationTime = new Date(
            new Date().getTime() + +userData.expires_in * 1000
        );

        this._user.next(
            new User(
                email,
                userData.token_type,
                userData.access_token,
                userData.refresh_token,
                expirationTime
            )
        );

        this.storeAuthData(
            email,
            userData.token_type,
            userData.access_token,
            userData.refresh_token,
            expirationTime.toString()
        );
    }

    /** This allow to storage the user on app storage */
    private storeAuthData(
        email: string,
        tokenType: string,
        token: string,
        refreshToken: string,
        tokenExpirationDate: string
    ) {
        const data = JSON.stringify({
            email, tokenType, token,
            refreshToken, tokenExpirationDate
        });

        Plugins.Storage.set({ key: 'authData', value: data });
    }
}
