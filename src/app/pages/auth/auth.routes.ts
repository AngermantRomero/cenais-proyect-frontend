import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/components/login/login.component';
import { AuthComponent } from './auth.component'; 

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        title: 'Iniciar sesión',
        component: LoginComponent
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
