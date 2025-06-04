import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { MainLayoutComponent } from './main-layout.component';
import { UsersComponent } from './components/users/users.component';
import { EquipmentsComponent } from './components/equipments/equipments.component';
import { SitesComponent } from './components/sites/sites.component';
import { MakerComponent } from './components/maker/maker.component';
export const mainLayoutRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
       {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
    },
      {
        path: 'users',
        component: UsersComponent
      },
      {
      path: 'equipments',
      component: EquipmentsComponent
      },
      {
      path: 'sites',
      component: SitesComponent
      }, 
       {
      path: 'maker',
      component: MakerComponent
      },   
    ]
  }
];
