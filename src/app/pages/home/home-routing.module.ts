import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: HomePage,
        children: [
            {
                path: 'dashboard',
                loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
            },
            {
                /**
                 * CLASES ROUTES
                 */
                path: 'clases',
                children: [
                    {
                        path: '',
                        loadChildren: '../clases/clases.module#ClasesPageModule'
                    },
                    {
                        path: 'wods/:wodId/show',
                        loadChildren:
                        '../clases/clases-today/clases-today.module#ClasesTodayPageModule'
                    },
                    /**
                     * RESERVATIONS ROUTES
                     */
                    {
                        path: ':claseId/show',
                        loadChildren:
                            '../reservations/add-confirm/add-confirm.module#AddConfirmPageModule'
                    },
                    {
                        path: ':wodId/edit-confirm',
                        loadChildren:
                            '../reservations/edit-confirm/edit-confirm.module#EditConfirmPageModule'
                    },
                    {
                        path: 'clase-type',
                        loadChildren:
                            '../reservations/select-clase-type/select-clase-type.module#SelectClaseTypePageModule'
                    },
                    {
                        path: 'clase-type/:claseTypeId/select-day',
                        loadChildren:
                            '../reservations/select-day/select-day.module#SelectDayPageModule'
                    },
                    {
                        path: 'clase-type/:claseTypeId/select-day/:date',
                        loadChildren:
                            '../reservations/select-hour/select-hour.module#SelectHourPageModule'
                    },
                ]
            },
            {
                /**
                 * PLANS ROUTES
                 */
                path: 'plans',
                children: [
                    {
                        path: '',
                        loadChildren: '../plans/plans.module#PlansPageModule'
                    },
                    {
                        path: 'historial',
                        loadChildren: '../plans/historial/historial.module#HistorialPageModule'
                    },
                    {
                        path: ':planId/details',
                        loadChildren: '../plans/plan-detail/plan-detail.module#PlanDetailPageModule'
                    },
                    {
                        path: ':planId/payments',
                        loadChildren: '../plans/plan-payment/plan-payment.module#PlanPaymentPageModule'
                    },
                    {
                        path: ':planId/flow',
                        loadChildren:
                            '../plans/flow/flow.module#FlowPageModule'
                    },
                ]
            },
            {
                /**
                 * PROFILE ROUTES
                 */
                path: 'profile',
                loadChildren: '../profile/profile.module#ProfilePageModule'
            },
        ]
    },
    {
        path: '',
        redirectTo: '/home/tabs/dashboard',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})
export class HomePageRoutingModule {}
