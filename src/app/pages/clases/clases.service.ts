// import { environment } from '../../../environments/environment';

// import { HttpClient, HttpHeaders } from '@angular/common/http';

// import { from } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { Plugins } from '@capacitor/core';

// export class ClasesService {
//     pendient: any;
//     confirmed: any;
//     constructor(private http: HttpClient) {}

//     /** [comingClases description] */
//     comingClases() {
//         return from(Plugins.Storage.get({ key: 'authData' })).pipe(
//             map(storeData => {
//                 // console.log(storeData);
//                 if (!storeData || !storeData.value) {
//                     console.log('!storeData');
//                     return null;
//                 }

//                 const parsedData = JSON.parse(storeData.value) as { token: string };

//                 const httpOptions = {
//                     headers: new HttpHeaders({
//                         Authorization: `Bearer ${parsedData.token}`
//                     })
//                 };

//                 this.http.get(`${environment.SERVER_URL}/clases-coming?sort_by_asc=date`, httpOptions)
//                     .subscribe((result: any) => {
//                         this.pendient =  result.data.filter(
//                             clase => clase.rels.auth_reservation.status === 'Pendiente'
//                         );

//                         this.confirmed =  result.data.filter(
//                             clase => clase.rels.auth_reservation.status === 'Confirmada'
//                         );
//                     },
//                 err => {
//                     console.log('error clases');
//                     // this.authService.refreshToken();
//                 });
//             })
//         );
//     }
// }
