import { Routes } from '@angular/router';
export const routes: Routes = [
   {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.routes').then(m => m.authRoutes)
  },
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  
  {
  path: '**',
  redirectTo: 'auth'
}
];