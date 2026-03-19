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
  selector: 'app-type-selector-dialog',
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
      <mat-icon>category</mat-icon>
      Seleccionar Tipo de Equipo
    </h2>

    <mat-dialog-content class="dialog-content">
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar tipo</mat-label>
        <input matInput [(ngModel)]="searchTerm" placeholder="Nombre del tipo...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <mat-selection-list #typeList 
        (selectionChange)="onSelectionChange($event)" 
        [multiple]="false"
        class="type-list">
        
        <!-- Opción "Todos los tipos" -->
        <mat-list-option [value]="'all'" class="all-option">
          <div class="all-option-content">
            <mat-icon>apps</mat-icon>
            <span>Todos los tipos</span>
          </div>
        </mat-list-option>

        <mat-divider></mat-divider>

        <!-- Tipos -->
        <mat-list-option 
          *ngFor="let type of filteredTypes" 
          [value]="type.id"
          [selected]="type.id === selectedId">
          <div class="type-item">
            <span class="type-name">{{ type.name }}</span>
          </div>
        </mat-list-option>
      </mat-selection-list>

      <div *ngIf="filteredTypes.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <p>No se encontraron tipos</p>
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

    .type-list {
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

    .type-item {
      padding: 4px 0;
      
      .type-name {
        color: #333;
        font-weight: 500;
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
export class TypeSelectorDialogComponent {
  searchTerm: string = '';
  selectedId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<TypeSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { types: any[], selectedId: string }
  ) {
    this.selectedId = data.selectedId || null;
    console.log('📦 Tipos recibidos:', data.types);
  }

  get filteredTypes() {
    return this.data.types.filter(type => 
      !this.searchTerm || 
      type.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
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
      this.dialogRef.close({ id: '', name: 'Todos los tipos' });
    } else if (this.selectedId) {
      const type = this.data.types.find(t => t.id === this.selectedId);
      console.log('🔧 Tipo seleccionado:', type);
      this.dialogRef.close(type);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}