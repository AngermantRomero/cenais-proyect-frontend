import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RepairService } from '../../../../core/services/repair.service';
import { Repair,RepairFilter } from '../../../../core/interfaces/repair.interface';
import { RepairFormComponent } from './repair-form/repair-formcomponent';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { RepairFiltersComponent } from './components/repair-filters/repair-filters.component';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-repair-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RepairFiltersComponent
  ],
  templateUrl: './repair-list.component.html',
  styleUrls: ['./repair-list.component.scss']
})
export class RepairListComponent implements OnInit {
  displayedColumns: string[] = [
    'equipment',
    'description',
    'startDate',
    'endDate',
    'status',
    'technician',
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Repair>([]);
  isLoading = false;
  isAdmin = false;

  constructor(
    private repairService: RepairService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRepairs();
    this.isAdmin = this.authService.getUserData()?.role?.name === 'Administrator';
  }

  loadRepairs(filter?: RepairFilter): void {
    this.isLoading = true;
    this.repairService.getRepairs(filter).subscribe({
      next: (repairs) => {
         console.log('🔍 TODAS las reparaciones:', repairs);
      console.log('🔍 Primera reparación:', repairs[0]);
      console.log('🔍 Equipment de primera reparación:', repairs[0]?.equipment);
      console.log('🔍 Serial:', repairs[0]?.equipment?.serialNumber);
      console.log('🔍 Inventario:', repairs[0]?.equipment?.inventoryNumber);
        this.dataSource.data = repairs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading repairs:', error);
        this.snackBar.open('❌ Error al cargar reparaciones', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  onFilterChange(filter: RepairFilter): void {
    this.loadRepairs(filter);
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(RepairFormComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairs();
        this.snackBar.open('✅ Reparación creada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  openEditDialog(repair: Repair): void {
    const dialogRef = this.dialog.open(RepairFormComponent, {
      width: '600px',
      data: { mode: 'edit', repair }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRepairs();
        this.snackBar.open('✅ Reparación actualizada', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteRepair(repair: Repair): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar reparación',
        message: `¿Estás seguro de eliminar la reparación del equipo ${repair.equipment.serialNumber}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.repairService.deleteRepair(repair.id).subscribe({
          next: () => {
            this.snackBar.open('✅ Reparación eliminada', 'Cerrar', { duration: 3000 });
            this.loadRepairs();
          },
          error: (error) => {
            console.error('Error deleting repair:', error);
            this.snackBar.open('❌ Error al eliminar', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  completeRepair(repair: Repair): void {
    this.repairService.completeRepair(repair.id).subscribe({
      next: () => {
        this.snackBar.open('✅ Reparación completada', 'Cerrar', { duration: 3000 });
        this.loadRepairs();
      },
      error: (error) => {
        console.error('Error completing repair:', error);
        this.snackBar.open('❌ Error al completar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getStatusChipClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_progress': 'En progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }
}