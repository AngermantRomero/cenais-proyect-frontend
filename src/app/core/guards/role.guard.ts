import { Injectable } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUserData(); 
  const expectedRoles: string[] = route.data['roles'];

  if (!user || !user.role || !expectedRoles.includes(user.role.name)) {
    // Opcional: redirige si no tiene permisos
    router.navigate(['/login']); 
    return false;
  }

  return true;
};

