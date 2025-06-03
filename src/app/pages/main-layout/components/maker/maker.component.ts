import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../../core/services/country.service';
import { MakerService } from '../../../../core/services/maker.service';
import { Maker,Country } from '../../../../core/interfaces/maker.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MakerFormComponent } from './maker-form/maker-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ArrayResponse } from '../../../../core/interfaces/http.responses.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-maker',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './maker.component.html',
  styleUrls: ['./maker.component.scss'],
})
export class MakerComponent implements OnInit {
   makers: Maker[] = [];
   countries: Country[] = [];
  displayedColumns: string[] = ['brand', 'description', 'country', 'actions'];
  isLoading: boolean = false;

 constructor(
    private makerService: MakerService,
    private countryService: CountryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

 ngOnInit(): void {
    this.loadCountries();
    this.loadMakers();
  }

  loadMakers(): void {
    this.isLoading = true;
    this.makerService.getMakers().subscribe({
      next: (response: ArrayResponse<Maker>) => {
        this.makers = response.data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar fabricantes:', err);
        this.snackBar.open('Error al cargar fabricantes', 'Cerrar', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe({
      next: (response: ArrayResponse<Country>) => {
        this.countries = response.data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar países:', err);
        this.snackBar.open('Error al cargar países', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }


   openMakerForm(maker?: Maker): void {
    const dialogRef = this.dialog.open(MakerFormComponent, {
      width: '600px',
      data: { 
        maker,
        countries: this.countries
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadMakers();
      }
    });
  }

  deleteMaker(maker: Maker): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar el fabricante ${maker.brand}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.makerService.deleteMaker(maker.idMaker).subscribe({
          next: () => {
            this.snackBar.open('Fabricante eliminado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadMakers();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error al eliminar fabricante:', err);
            this.snackBar.open('Error al eliminar fabricante', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}