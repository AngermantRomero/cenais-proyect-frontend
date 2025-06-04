import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
@Component({
  selector: 'app-main-layout',  
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
  ],
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private userRole = this.authService.getUserData()?.role?.name ?? null;

menuItems = [
    { id: 1, label: 'Dashboard', icon: 'dashboard', path: 'dashboard', roles: ['Administrator', 'Technician', 'Guest'], },
    { id: 2, label: 'Usuarios', icon: 'group', path: 'users',roles: ['Administrator'], },
    { id: 3, label: 'Equipos', icon: 'devices', path: 'equipments', roles: ['Administrator', 'Technician'], },
    { id: 4, label: 'Sitios', icon: 'place', path: 'sites', roles: ['Administrator', 'Technician'], },
    { id: 5, label: 'Fabricantes', icon: 'factory', path: 'maker', roles: ['Administrator' ], },
  ];


  logout() {
    this.authService.logout();
  }

  get filteredMenuItems() {
    return this.menuItems.filter(item => item.roles.includes(this.userRole!));
  }
}
