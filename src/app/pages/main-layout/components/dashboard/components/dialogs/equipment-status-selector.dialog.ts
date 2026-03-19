import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-equipment-status-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>check_circle</mat-icon>
      Seleccionar Estado de Equipo
    </h2>

    <mat-dialog-content class="dialog-content">
      <mat-selection-list #statusList 
        (selectionChange)="onSelectionChange($event)" 
        [multiple]="false"
        class="status-list">
        
        <!-- Opción "Todos los estados" -->
        <mat-list-option [value]="'all'" class="all-option">
          <div class="all-option-content">
            <mat-icon>apps</mat-icon>
            <span>Todos los estados</span>
          </div>
        </mat-list-option>

        <mat-divider></mat-divider>

        <!-- Estados de equipos -->
        <mat-list-option 
          *ngFor="let status of data.statuses" 
          [value]="status.id"
          [selected]="status.id === selectedValue">
          <div class="status-item">
            <span class="status-badge" [style.background]="status.color || '#e0e0e0'" [style.color]="getTextColor(status.color)">
              {{ status.name }}
            </span>
          </div>
        </mat-list-option>
      </mat-selection-list>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button class="cancel-btn" (click)="onCancel()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="primary" (click)="onSelect()" [disabled]="!selectedValue">
        <mat-icon>check</mat-icon>
        Seleccionar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #800020;
      padding: 16px 24px;
      margin: 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 18px;
    }

    .dialog-content {
      padding: 16px 24px !important;
      max-height: 400px;
      overflow-y: auto;
    }

    .status-list {
      padding-top: 0;
    }

    .all-option {
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 8px;
      
      .all-option-content {
        display: flex;
        align-items: center;
        gap: 8px;
        
        mat-icon {
          color: #800020;
        }
      }
    }

    .status-item {
      padding: 4px 0;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
      gap: 8px;
    }

    .cancel-btn {
      border: 1px solid #ddd;
      color: #666;
    }
  `]
})
export class EquipmentStatusSelectorDialogComponent {
  selectedValue: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<EquipmentStatusSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { statuses: any[], selected: string }
  ) {
    this.selectedValue = data.selected || null;
    console.log('📊 Estados de equipos recibidos:', data.statuses);
  }

  getTextColor(background: string): string {
    if (!background) return '#333';
    // Calcular si el fondo es oscuro o claro
    const r = parseInt(background.slice(1, 3), 16);
    const g = parseInt(background.slice(3, 5), 16);
    const b = parseInt(background.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#333' : 'white';
  }

  onSelectionChange(event: any): void {
    const selectedOptions = event.source.selectedOptions.selected;
    if (selectedOptions && selectedOptions.length > 0) {
      this.selectedValue = selectedOptions[0].value;
      console.log('✅ Estado seleccionado:', this.selectedValue);
    } else {
      this.selectedValue = null;
    }
  }

  onSelect(): void {
    if (this.selectedValue === 'all') {
      this.dialogRef.close({ id: '', name: 'Todos los estados' });
    } else if (this.selectedValue) {
      const status = this.data.statuses.find(s => s.id === this.selectedValue);
      this.dialogRef.close(status);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}