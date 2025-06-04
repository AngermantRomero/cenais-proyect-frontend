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

menuItems = [
    { id: 1, label: 'Dashboard', icon: 'dashboard', path: 'dashboard' },
    { id: 2, label: 'Usuarios', icon: 'group', path: 'users' },
    { id: 3, label: 'Equipos', icon: 'devices', path: 'equipments' },
    { id: 4, label: 'Sitios', icon: 'place', path: 'sites' },
    { id: 5, label: 'Fabricantes', icon: 'factory', path: 'maker' },
  ];

  private router= inject(Router)

  logout() {
    this.authService.logout();
  }
}
