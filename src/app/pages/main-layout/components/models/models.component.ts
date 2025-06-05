import { Component, OnInit } from '@angular/core';
import { ModelService } from '../../../../core/services/model.service';
import { MakerService } from '../../../../core/services/maker.service';
import { Model} from '../../../../core/interfaces/model.interface';
import { Maker } from '../../../../core/interfaces/maker.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModelFormComponent } from './model-form/model-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ArrayResponse } from '../../../../core/interfaces/http.responses.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-models',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.scss'],
})
export class ModelsComponent implements OnInit {
  models: Model[] = [];
  makers: Maker[] = [];
  displayedColumns: string[] = ['modelName', 'description', 'maker', 'actions'];
  isLoading: boolean = false;
  searchTerm: string = '';

  constructor(
    private modelService: ModelService,
    private makerService: MakerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMakers();
    this.loadModels();
  }

  loadModels(): void {
    this.isLoading = true;
    const filters = this.searchTerm ? { modelName: this.searchTerm } : undefined;
    
    this.modelService.getModels(filters).subscribe({
      next: (response: ArrayResponse<Model>) => {
        this.models = response.data;
        this.models = response.data.map(model => ({
      ...model,
      // Asegúrate que makerBrand se mantenga
      makerBrand: model.makerBrand
    }));
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar modelos:', err);
        this.snackBar.open('Error al cargar modelos', 'Cerrar', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadMakers(): void {
    this.makerService.getMakers().subscribe({
      next: (response: ArrayResponse<Maker>) => {
        this.makers = response.data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar fabricantes:', err);
        this.snackBar.open('Error al cargar fabricantes', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  openModelForm(model?: Model): void {
    const dialogRef = this.dialog.open(ModelFormComponent, {
      width: '600px',
      data: { 
        model,
        makers: this.makers
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadModels();
      }
    });
  }

  deleteModel(model: Model): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar el modelo ${model.modelName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.modelService.deleteModel(model.id).subscribe({
          next: () => {
            this.snackBar.open('Modelo eliminado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadModels();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error al eliminar modelo:', err);
            this.snackBar.open('Error al eliminar modelo', 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    });
  }

  applyFilter(): void {
    this.loadModels();
  }

  clearFilter(): void {
    this.searchTerm = '';
    this.loadModels();
  }
}
