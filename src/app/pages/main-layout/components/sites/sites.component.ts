import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SitesService } from '../../../../core/services/site.service';
import { ProvincesService } from '../../../../core/services/province.service';
import { SiteFormComponent } from './sites-form/sites-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Site, Province } from '../../../../core/interfaces/sites.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-sites',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  dataSource = new MatTableDataSource<Site>();
  displayedColumns: string[] = ['code', 'locality', 'province', 'actions'];
  provinces: Province[] = [];
  isLoading: boolean = false;
  searchFilter: string = '';

  constructor(
    private sitesService: SitesService,
    private dialog: MatDialog,
    private provincesService: ProvincesService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
  this.isLoading = true;
  this.sitesService.getSitesWithProvinceNames().subscribe({
    next: (sites) => {
      this.dataSource.data = sites;
      this.isLoading = false;
      console.log('Datos recibidos:', sites); // Para depuración
    },
    error: (error) => {
      console.error('Error cargando sitios:', error);
      this.isLoading = false;
    }
  });
      this.provincesService.getProvinces().subscribe(provinces => {
    this.provinces = provinces;
  });
}


  openCreateDialog(): void {
    const dialogRef = this.dialog.open(SiteFormComponent, {
      width: '500px',
      data: { 
        mode: 'create',
        provinces: this.provinces 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadInitialData();
    });
  }

  editSite(site: Site): void {
    const dialogRef = this.dialog.open(SiteFormComponent, {
      width: '500px',
      data: { 
        site,
        mode: 'edit',
        provinces: this.provinces
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadInitialData();
    });
  }

  deleteSite(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de eliminar este sitio?',
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.isLoading = true;
        this.sitesService.deleteSite(id).subscribe({
          next: () => this.loadInitialData(),
          error: () => this.isLoading = false
        });
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchFilter.trim().toLowerCase();
  }

  clearFilter(): void {
    this.searchFilter = '';
    this.applyFilter();
  }
}