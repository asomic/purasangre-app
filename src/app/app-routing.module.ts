import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './pages/auth/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        loadChildren: './pages/auth/auth.module#AuthPageModule'
    },
    {
        path: 'home',
        loadChildren: './pages/home/home.module#HomePageModule',
        canLoad: [ AuthGuard ]
    },
    {
        path: 'confirm',
        loadChildren: './pages/reservations/confirm/confirm.module#ConfirmPageModule'
    },
    {
        path: 'forgot',
        loadChildren: './pages/auth/forgot/forgot.module#ForgotPageModule'
    },


  // {
  //   path: 'edit-confirm',
  //   loadChildren: () => import('./pages/clases/edit-confirm/edit-confirm.module').then( m => m.EditConfirmPageModule)
  // },


    // {
    //     path: 'tutorial',
    //     loadChildren: './public/tutorial/tutorial.module#TutorialPageModule'
    // },
    // {
    //     path: 'hoydashboard',
    //     loadChildren: './auth/dashboard/hoydashboard/hoydashboard.module#HoyDashboardPageModule'
    // },
    // {
    //     path: 'login',
    //     loadChildren: './public/login/login.module#LoginPageModule'
    // },
    // {
    //     path: 'forgot',
    //     loadChildren: './public/forgot/forgot.module#ForgotPageModule'
    // },
    // {
    //     path: 'tutorial',
    //     loadChildren: './public/tutorial/tutorial.module#TutorialPageModule'
    // },
    // {
    //     path: 'image-modal',
    //     loadChildren: './auth/shared/image-modal/image-modal.module#ImageModalPageModule'
    // },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule { }
