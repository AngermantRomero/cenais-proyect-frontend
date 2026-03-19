import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { EquipmentService } from '../../../../../../core/services/equipement.service';

@Component({
  selector: 'app-equipment-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>history</mat-icon>
      Historial de Cambios - {{ data.equipment.serialNumber }}
    </h2>

    <mat-dialog-content class="dialog-content">
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!isLoading && history.length === 0" class="no-history">
        <mat-icon>info</mat-icon>
        <p>No hay registros de cambios de estado</p>
      </div>

      <div class="timeline" *ngIf="!isLoading && history.length > 0">
        <div *ngFor="let record of history" class="timeline-item">
          <div class="timeline-dot" [style.background]="record.state.color || '#800020'"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="state-name">{{ record.state.name }}</span>
              <span class="timeline-date">{{ record.changedAt | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="timeline-footer">
              <span class="changed-by">
                <mat-icon>person</mat-icon>
                {{ record.changedBy || 'sistema' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button class="close-btn" (click)="onClose()">
        <mat-icon>close</mat-icon>
        Cerrar
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
    }

    .dialog-content {
      padding: 16px 24px !important;
      max-height: 400px;
      overflow-y: auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 32px;
    }

    .no-history {
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

    .timeline {
      position: relative;
      padding: 16px 0;
      
      &::before {
        content: '';
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #e0e0e0;
      }
    }

    .timeline-item {
      position: relative;
      padding-left: 52px;
      margin-bottom: 24px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }

    .timeline-dot {
      position: absolute;
      left: 14px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1;
    }

    .timeline-content {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 8px;
      
      .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        
        .state-name {
          font-weight: 600;
          color: #333;
        }
        
        .timeline-date {
          font-size: 11px;
          color: #666;
        }
      }
      
      .timeline-footer {
        .changed-by {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #999;
          
          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }
    }

    .dialog-actions {
      padding: 16px 24px;
      border-top: 1px solid #f0f0f0;
      
      .close-btn {
        border: 1px solid #ddd;
        color: #666;
        
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  `]
})
export class EquipmentHistoryDialogComponent implements OnInit {
  history: any[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<EquipmentHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { equipment: any },
    private equipmentService: EquipmentService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.equipmentService.getEquipmentStateHistory(this.data.equipment.id).subscribe({
      next: (history) => {
        this.history = history;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}