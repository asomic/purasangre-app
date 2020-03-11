import { environment } from '../../../environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Plugins } from '@capacitor/core';

import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, from } from 'rxjs';

import { User } from '../../models/users/user.model';
import { Profile } from '../../models/users/profile.model';

const TOKEN_KEY = 'auth-token';
// const REFRESH_TOKEN = 'refresh-token';

interface ProfileData {
    [ data: string ]: {
        identificador: string,
        profileId: string,
        nombre: string,
        avatar: string,
        apellido: string,
        genero: string,
        fechaNacimiento: string,
        correo: string,
        direccion: string,
        rels: {
            active_plan: {
                plan: string,
                expiration: string
            },
            stats: {
                clases_consumed: string,
                clases_lost: string,
                clases_quantity: string
            }
        }
    };
}

@Injectable({
    providedIn: 'root'
})

export class ProfileService {
    // private user = new BehaviorSubject<User>(null);

    // tslint:disable-next-line: variable-name
    private _profile = new BehaviorSubject<Profile>(null);

    /**
     * Get local profile
     */
    get profile() {
        // console.log(this._profile.value);
        return this._profile.asObservable();
    }

    /**
     * Get the user id from the Profile Model
     *
     * @return string (yes, it's an string)
     */
    get profileId() {
        return this._profile.asObservable().pipe(
            map(profile => {
                if ( profile ) {
                    return !!profile.id;
                }

                return false;
            })
        );
    }

    constructor(private http: HttpClient) {}

    nullProfile() {
        this._profile.next(null);
    }

    fetchProfile() {
        return from(Plugins.Storage.get({ key: 'authData' })).pipe(
            map(storeData => {
                if ( storeData && storeData.value ) {
                    const parsedData = JSON.parse(storeData.value) as {
                        email: string,
                        tokenType: string,
                        token: string,
                        refreshToken: string,
                        tokenExpirationDate: string
                    };

                    const httpOptions = {
                        headers: new HttpHeaders({
                            Authorization: `${parsedData.tokenType} ${parsedData.token}` // updated
                        })
                    };

                    return this.http.get<ProfileData>(`${environment.SERVER_URL}/profile`, httpOptions)
                        .subscribe(result => {
                            this.setProfileData(result);
                        });
                }
            }),
            // tap(profile => {
            //     if (profile) {
            //         this._profile.next(profile);
            //     }
            // }),
            // map(profile => {
            //     return !!profile;
            // })
        );
    }

    getloadedProfile() {
        return from(Plugins.Storage.get({ key: 'authProfile' })).pipe(
            map(profile => {
                const parsedData = JSON.parse(profile.value);
                const loadedProfile = [];

                loadedProfile.push(
                    new Profile(
                        parsedData.identificador,
                        parsedData.firstName,
                        parsedData.lastName,
                        parsedData.email,
                        parsedData.gender,
                        parsedData.birthdate,
                        parsedData.avatar,
                        parsedData.address,
                        parsedData.actualPlan,
                        parsedData.actualPlanFinishDate,
                        parsedData.clasesConsumidas,
                        parsedData.clasesPerdidas,
                        parsedData.clasesTotales
                    )
                );

                return loadedProfile;
            })
        );
    }


    private setProfileData(profileData: ProfileData) {
        this._profile.next(
            new Profile(
                profileData.data.identificador,
                profileData.data.nombre,
                profileData.data.apellido,
                profileData.data.correo,
                profileData.data.genero,
                new Date(profileData.data.fechaNacimiento),
                profileData.data.avatar,
                profileData.data.direccion,
                profileData.data.rels.active_plan ? profileData.data.rels.active_plan.plan : null,
                profileData.data.rels.active_plan ? profileData.data.rels.active_plan.expiration : null,
                profileData.data.rels.stats ? profileData.data.rels.stats.clases_consumed : null,
                profileData.data.rels.stats ? profileData.data.rels.stats.clases_lost : null,
                profileData.data.rels.stats ? profileData.data.rels.stats.clases_quantity : null
            )
        );

        this.storeProfileData(
            profileData.data.identificador,
            profileData.data.nombre,
            profileData.data.apellido,
            profileData.data.correo,
            profileData.data.genero,
            new Date(profileData.data.fechaNacimiento),
            profileData.data.avatar,
            profileData.data.direccion,
            profileData.data.rels.active_plan ? profileData.data.rels.active_plan.plan : null,
            profileData.data.rels.active_plan ? profileData.data.rels.active_plan.expiration : null,
            profileData.data.rels.stats ? profileData.data.rels.stats.clases_consumed : null,
            profileData.data.rels.stats ? profileData.data.rels.stats.clases_lost : null,
            profileData.data.rels.stats ? profileData.data.rels.stats.clases_quantity : null,
        );
    }

    /** This allow to storage the user on app storage */
    private storeProfileData(
        identificador: string,
        nombre: string,
        apellido: string,
        correo: string,
        genero: string,
        fechaNacimiento: Date,
        avatar: string,
        direccion: string,
        actualPlan: string,
        actualPlanExpiration: string,
        clasesConsumidas: string,
        clasesPerdidas: string,
        clasesTotales: string
    ) {
        const data = JSON.stringify({
            identificador, nombre, apellido, correo,
            genero, fechaNacimiento, avatar, direccion, actualPlan,
            actualPlanExpiration, clasesConsumidas, clasesPerdidas, clasesTotales
        });

        Plugins.Storage.set({ key: 'authProfile', value: data });
    }
}
