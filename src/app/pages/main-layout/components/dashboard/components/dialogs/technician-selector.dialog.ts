import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-technician-selector-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>person</mat-icon>
      Seleccionar Técnico
    </h2>

    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar técnico</mat-label>
        <input matInput [(ngModel)]="searchTerm" placeholder="Nombre o email...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-selection-list #techList 
        (selectionChange)="onSelectionChange($event)" 
        [multiple]="false"
        class="tech-list">
        
        <!-- Opción "Todos los técnicos" -->
        <mat-list-option [value]="'all'" class="all-option">
          <div class="all-option-content">
            <mat-icon>group</mat-icon>
            <span>Todos los técnicos</span>
          </div>
        </mat-list-option>

        <mat-divider></mat-divider>

        <!-- Técnicos -->
        <mat-list-option 
          *ngFor="let tech of filteredTechnicians" 
          [value]="tech.id"
          [selected]="tech.id === selectedId">
          <div class="tech-item">
            <span class="tech-name">{{ tech.name }} {{ tech.lastName || '' }}</span>
            <span class="tech-email">{{ tech.email }}</span>
          </div>
        </mat-list-option>
      </mat-selection-list>

      <div *ngIf="filteredTechnicians.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <p>No se encontraron técnicos</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button class="cancel-btn" (click)="onCancel()">
        <mat-icon>close</mat-icon>
        Cancelar
      </button>
      <button mat-raised-button color="primary" (click)="onSelect()" [disabled]="!selectedId">
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

    .search-field {
      width: 100%;
      margin-bottom: 16px;
    }

    .tech-list {
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

    .tech-item {
      display: flex;
      flex-direction: column;
      
      .tech-name {
        font-weight: 500;
        color: #333;
      }
      
      .tech-email {
        font-size: 11px;
        color: #666;
      }
    }

    .no-results {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 32px;
      color: #999;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 8px;
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
export class TechnicianSelectorDialogComponent {
  searchTerm: string = '';
  selectedId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TechnicianSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { technicians: any[], selectedId: string }
  ) {
    this.selectedId = data.selectedId || null;
    console.log('👥 Técnicos recibidos:', data.technicians);
  }

  get filteredTechnicians() {
    return this.data.technicians.filter(tech => 
      !this.searchTerm || 
      tech.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      tech.lastName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      tech.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSelectionChange(event: any): void {
    console.log('🔵 Evento de selección:', event);
    
    const selectedOptions = event.source.selectedOptions.selected;
    console.log('✅ Opciones seleccionadas:', selectedOptions);
    
    if (selectedOptions && selectedOptions.length > 0) {
      this.selectedId = selectedOptions[0].value;
      console.log('✅ ID seleccionado:', this.selectedId);
    } else {
      this.selectedId = null;
    }
  }

  onSelect(): void {
    console.log('🎯 Seleccionando ID:', this.selectedId);
    
    if (this.selectedId === 'all') {
      this.dialogRef.close({ id: '', name: 'Todos los técnicos' });
    } else if (this.selectedId) {
      const tech = this.data.technicians.find(t => t.id === this.selectedId);
      console.log('👤 Técnico seleccionado:', tech);
      this.dialogRef.close(tech);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}