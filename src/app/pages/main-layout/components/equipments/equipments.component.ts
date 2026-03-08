// equipments.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EquipmentService } from '../../../../core/services/equipement.service';
import { Equipment } from '../../../../core/interfaces/equipement.interface';
import { MatDialog } from '@angular/material/dialog';
import { EquipmentFormComponent } from './component/equipements-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss'],
})
export class EquipmentsComponent implements OnInit {
  isAdmin: boolean = false;
  columnsBase: string[] = [
    'serialNumber',
    'inventoryNumber',
    'type',
    'maker',
    'model',
    'state',
    'location'
  ];
  dataSource = new MatTableDataSource<Equipment>([]);

  constructor(
    private equipmentService: EquipmentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEquipment();
    this.isAdmin = this.authService.getUserData()?.role?.name === 'Administrator';  
  }

  get displayedColumns(): string[] {
    return this.isAdmin
      ? [...this.columnsBase, 'actions']
      : this.columnsBase;
  }
  openCreateDialog(): void {
    this.dialog
      .open(EquipmentFormComponent, {
        width: '800px',
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadEquipment();
        }
      });
  }

  openEditDialog(equipment: Equipment): void {
    this.dialog
      .open(EquipmentFormComponent, {
        width: '800px',
        data: { equipment },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadEquipment();
        }
      });
  }
  isLoading = false;

  loadEquipment(): void {
  this.isLoading = true;
  this.equipmentService.getEquipments().subscribe({
    next: (equipments) => {
      this.dataSource.data = equipments; 
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.dataSource.data = [];
      this.snackBar.open('Error al cargar equipos', 'Cerrar', { duration: 3000 });
    }
  });
}

deleteEquipment(equipmentId: string): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: { 
      title: 'Eliminar equipo', 
      message: '¿Estás seguro de eliminar este equipo permanentemente?' 
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.equipmentService.deleteEquipment(equipmentId).subscribe({
        next: () => {
          this.snackBar.open('✅ Equipo eliminado', 'Cerrar', { 
            duration: 3000 
          });
          this.loadEquipment();
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          this.snackBar.open('❌ Error al eliminar el equipo', 'Cerrar', { 
            duration: 3000 
          });
        }
      });
    }
  });
  }
  }

