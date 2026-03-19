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
  selector: 'app-site-selector-dialog',
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
      <mat-icon>place</mat-icon>
      Seleccionar Sitio
    </h2>

    <mat-dialog-content class="dialog-content">
      <!-- Buscador -->
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Buscar sitio</mat-label>
        <input matInput [(ngModel)]="searchTerm" placeholder="Código o localidad...">
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <!-- Lista de sitios -->
      <mat-selection-list #siteList 
        (selectionChange)="onSelectionChange($event)" 
        [multiple]="false"
        class="site-list">
        
        <!-- Opción "Todos los sitios" -->
        <mat-list-option [value]="'all'" class="all-option">
          <div class="all-option-content">
            <mat-icon>public</mat-icon>
            <span>Todos los sitios</span>
          </div>
        </mat-list-option>

        <mat-divider></mat-divider>

        <!-- Sitios -->
        <mat-list-option 
          *ngFor="let site of filteredSites" 
          [value]="site.id"
          [selected]="site.id === selectedId">
          <div class="site-item">
            <span class="site-code">{{ site.code }}</span>
            <span class="site-locality">{{ site.locality }}</span>
            <span *ngIf="site.province" class="province-badge">
              {{ site.province.name }}
            </span>
          </div>
        </mat-list-option>
      </mat-selection-list>

      <div *ngIf="filteredSites.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <p>No se encontraron sitios</p>
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

    .site-list {
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

    .site-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 0;

      .site-code {
        font-weight: 600;
        color: #800020;
        min-width: 60px;
      }

      .site-locality {
        color: #333;
        flex: 1;
      }

      .province-badge {
        font-size: 11px;
        background: #f0f0f0;
        padding: 2px 8px;
        border-radius: 12px;
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
export class SiteSelectorDialogComponent {
  searchTerm: string = '';
  selectedId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<SiteSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { sites: any[], selectedId: string }
  ) {
    this.selectedId = data.selectedId || null;
    console.log('📦 Sitios recibidos:', data.sites);
  }

  get filteredSites() {
    return this.data.sites.filter(site => 
      !this.searchTerm || 
      site.code?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      site.locality?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // ✅ MÉTODO CORREGIDO
  onSelectionChange(event: any): void {
    console.log('🔵 Evento de selección:', event);
    
    // Obtener los valores seleccionados
    const selectedOptions = event.source.selectedOptions.selected;
    console.log('✅ Opciones seleccionadas:', selectedOptions);
    
    if (selectedOptions && selectedOptions.length > 0) {
      // Tomar el primer valor seleccionado
      this.selectedId = selectedOptions[0].value;
      console.log('✅ ID seleccionado:', this.selectedId);
    } else {
      this.selectedId = null;
    }
  }

  onSelect(): void {
    console.log('🎯 Seleccionando ID:', this.selectedId);
    
    if (this.selectedId === 'all') {
      this.dialogRef.close({ id: '', name: 'Todos los sitios' });
    } else if (this.selectedId) {
      const site = this.data.sites.find(s => s.id === this.selectedId);
      console.log('📍 Sitio seleccionado:', site);
      this.dialogRef.close(site);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}