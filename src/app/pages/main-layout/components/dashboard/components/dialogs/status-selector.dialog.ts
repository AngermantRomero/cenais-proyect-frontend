import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-status-selector-dialog',
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
      Seleccionar Estado
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

        <!-- Estados -->
        <mat-list-option 
          *ngFor="let status of data.statuses" 
          [value]="status.value"
          [selected]="status.value === selectedValue">
          <div class="status-item">
            <span class="status-badge" [ngClass]="'status-' + status.value">
              {{ status.label }}
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
      
      &.status-pending {
        background: #fff3e0;
        color: #e65100;
      }
      &.status-in_progress {
        background: #e3f2fd;
        color: #0d47a1;
      }
      &.status-completed {
        background: #e8f5e8;
        color: #1b5e20;
      }
      &.status-cancelled {
        background: #ffebee;
        color: #b71c1c;
      }
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
export class StatusSelectorDialogComponent {
  selectedValue: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<StatusSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { statuses: any[], selected: string }
  ) {
    this.selectedValue = data.selected || null;
    console.log('📊 Estados recibidos:', data.statuses);
  }

  onSelectionChange(event: any): void {
    console.log('🔵 Evento de selección:', event);
    
    const selectedOptions = event.source.selectedOptions.selected;
    console.log('✅ Opciones seleccionadas:', selectedOptions);
    
    if (selectedOptions && selectedOptions.length > 0) {
      this.selectedValue = selectedOptions[0].value;
      console.log('✅ Estado seleccionado:', this.selectedValue);
    } else {
      this.selectedValue = null;
    }
  }

  onSelect(): void {
    console.log('🎯 Seleccionando estado:', this.selectedValue);
    
    if (this.selectedValue === 'all') {
      this.dialogRef.close({ value: '', label: 'Todos los estados' });
    } else if (this.selectedValue) {
      const status = this.data.statuses.find(s => s.value === this.selectedValue);
      console.log('🏷️ Estado seleccionado:', status);
      this.dialogRef.close(status);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}