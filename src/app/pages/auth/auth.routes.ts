import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/components/login/login.component';
import { AuthComponent } from './auth.component'; 
import { SetPasswordComponent } from './components/set-password/set-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
       {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
      path: 'set-password',
      component: SetPasswordComponent
      },
      {
      path: 'reset-password',
      component: ForgotPasswordComponent
      },   
    ]
  }
];
