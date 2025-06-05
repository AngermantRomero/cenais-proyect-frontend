import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../../../core/services/site.service';
import { ProvinceService } from '../../../../core/services/province.service';
import { Site, Province } from '../../../../core/interfaces/sites.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SiteFormComponent } from './sites-form/sites-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule
  ],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss'],
})
export class SitesComponent implements OnInit {
  sites: Site[] = [];
  provinces: Province[] = [];
  isLoading: boolean = false;
  isAdmin: boolean = false;
  columnsBase = ['code', 'locality', 'province'];
  

  constructor(
    private siteService: SiteService,
    private provinceService: ProvinceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
    this.loadSites();  
    this.isAdmin = this.authService.getUserData()?.role?.name === 'Administrator';  
  }  

  get displayedColumns(): string[] {
    return this.isAdmin
      ? [...this.columnsBase, 'actions']
      : this.columnsBase;
  }

  

  loadSites(): void {
    this.isLoading = true;
    this.siteService.getSites().subscribe({
      next: (response) => {
        this.sites = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar sitios:', err);
        this.snackBar.open('Error al cargar sitios', 'Cerrar', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadProvinces(): void {
    this.provinceService.getProvinces().subscribe({
      next: (response) => {
        this.provinces = response.data;
      },
      error: (err) => {
        console.error('Error al cargar provincias:', err);
      }
    });
  }

  openSiteForm(site?: Site): void {
    const dialogRef = this.dialog.open(SiteFormComponent, {
      width: '600px',
      data: { 
        site,
        provinces: this.provinces
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadSites();
      }
    });
  }

  deleteSite(site: Site): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar el sitio ${site.code} - ${site.locality}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.siteService.deleteSite(site.id).subscribe({
          next: () => {
            this.snackBar.open('Sitio eliminado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadSites();
          },
          error: (err) => {
            console.error('Error al eliminar sitio:', err);
            this.snackBar.open('Error al eliminar sitio', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}