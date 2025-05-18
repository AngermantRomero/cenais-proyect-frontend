import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/main-layout/main-layout.routes').then(m => m.mainLayoutRoutes)
  },  
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