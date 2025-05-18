import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

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
menuItems = [
    { id: 1, label: 'Dashboard', icon: 'dashboard', path: 'dashboard' },
    { id: 2, label: 'Usuarios', icon: 'group', path: 'users' },
    { id: 3, label: 'Equipos', icon: 'devices', path: 'equipments' },
    { id: 4, label: 'Sitios', icon: 'place', path: 'sites' },
  ];

  private router= inject(Router)

  logout() {
    // lógica de logout (ej: AuthService.logout())
    this.router.navigate(['/login']);
  }
}
