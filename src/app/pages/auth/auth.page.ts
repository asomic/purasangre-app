import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController, AlertController } from '@ionic/angular';

import { AuthService } from './auth.service';
import { NgModel, NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
    // private isLoading = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) { }

    /**
     * Make the process of authentication of the user,
     * this show to user the await while manage the login process
     *
     * {string}  email
     * {string}  password
     *
     * @return Redirect
     */
    authenticate(email: string, password: string, form) {
        // this.isLoading = true;

        this.loadingCtrl.create({
            keyboardClose: true,
            message: 'Ingresando...',
            spinner: 'crescent'
        }).then(loadingEl => {
                // Load modal
                loadingEl.present();
                // Make the login
                const res = this.authService.login(email, password);

                res.subscribe(
                    // success login
                    resData => {
                        setTimeout(() => {
                        // this.isLoading = false;
                        loadingEl.dismiss();
                        form.reset();
                        // console.log('hola hola dismiss');
                        this.router.navigateByUrl('/home/tabs/dashboard');
                    }, 1500);
                },
                    // Failed Login
                    errRes => {
                        loadingEl.dismiss();

                        console.log(errRes);

                        new Date().getTime();

                        this.showAlert(errRes.error.error, errRes.error.message);
                    }
                );
            }
        );
    }

    /**
     *  This is for check the form by itself,
     *  If everything is correct go to login method
     */
    onSubmitLogin(form: NgForm) {
        console.log(form.value.email, form.value.password, form);
        this.authenticate(form.value.email, form.value.password, form);
    }

    /** Modal structure for Login errors */
    private showAlert(header: string, message: string) {
        this.alertCtrl
            .create({ header, message, buttons: ['Entendido'] })
            .then(alertEl => alertEl.present());
    }

    goToForgot() {
        console.log('hola');
        this.router.navigateByUrl('/forgot');
    }
}
