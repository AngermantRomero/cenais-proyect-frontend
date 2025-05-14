import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';


export const authRoutes: Routes = [
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
];