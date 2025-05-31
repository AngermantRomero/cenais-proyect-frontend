// equipments.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
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

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit {
  displayedColumns: string[] = [
    'serialNumber',
    'inventoryNumber',
    'type',
    'maker',
    'model',
    'state',
    'actions'
  ];
  dataSource: Equipment[] = [];

  constructor(private equipmentService: EquipmentService,private dialog: MatDialog,private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadEquipment();
  }
  openCreateDialog(): void {
  this.dialog.open(EquipmentFormComponent, {
    width: '800px'
  }).afterClosed().subscribe(result => {
    if (result) {
      this.loadEquipment();
    }
  });
}

openEditDialog(equipment: Equipment): void {
  this.dialog.open(EquipmentFormComponent, {
    width: '800px',
    data: { equipment }
  }).afterClosed().subscribe(result => {
    if (result) {
      this.loadEquipment();
    }
  });
}
  isLoading = false;

  loadEquipment(): void {
  this.isLoading = true;
  this.equipmentService.getEquipments().subscribe({
    next: (data) => {
      this.dataSource = data;
      this.isLoading = false;
    },
    error: () => this.isLoading = false
  });
}
  async deleteEquipment(equipmentId: string): Promise<void> {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Eliminar equipo',
      message: '¿Estás seguro de eliminar este equipo permanentemente?'
    }
  });

  const result = await dialogRef.afterClosed().toPromise();
  
  if (result) {
    this.equipmentService.deleteEquipment(equipmentId).subscribe({
      next: () => {
        this.snackBar.open('✅ Equipo eliminado', 'Cerrar', { duration: 3000 });
        this.loadEquipment();
      },
      error: () => {
        this.snackBar.open('❌ Error al eliminar', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
}