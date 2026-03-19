import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { TechnicianPerformance } from '../../../../../../core/interfaces/dashboard.interface';
import { SafeNumberPipe } from '../../../../../../shared/pipes/safe-number.pipe';

@Component({
  selector: 'app-top-technicians',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    SafeNumberPipe
  ],
  template: `
    <div class="technicians-container">
      <table mat-table [dataSource]="data" class="technicians-table">
        <!-- Posición -->
        <ng-container matColumnDef="position">
          <th mat-header-cell *matHeaderCellDef>#</th>
          <td mat-cell *matCellDef="let tech; let i = index">{{ i + 1 }}</td>
        </ng-container>

        <!-- Técnico -->
        <ng-container matColumnDef="technician">
          <th mat-header-cell *matHeaderCellDef>Técnico</th>
          <td mat-cell *matCellDef="let tech">
            <div class="technician-info">
              <mat-icon>person</mat-icon>
              <span>{{ tech.technicianName }}</span>
            </div>
          </td>
        </ng-container>

        <!-- Reparaciones Completadas -->
        <ng-container matColumnDef="completed">
          <th mat-header-cell *matHeaderCellDef>Completadas</th>
          <td mat-cell *matCellDef="let tech">
            <span class="badge completed">{{ tech.completedRepairs }}</span>
          </td>
        </ng-container>

        <!-- Tiempo Promedio -->
        <ng-container matColumnDef="avgTime">
          <th mat-header-cell *matHeaderCellDef>Tiempo Promedio</th>
          <td mat-cell *matCellDef="let tech">
            <span class="badge time">{{ tech.avgRepairTime | safeNumber }} <small>horas</small></span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            No hay datos de técnicos disponibles
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .technicians-container {
      .technicians-table {
        width: 100%;

        .technician-info {
          display: flex;
          align-items: center;
          gap: 8px;

          mat-icon {
            color: #800020;
            font-size: 20px;
          }
        }

        .badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;

          &.completed {
            background: #e8f5e8;
            color: #1b5e20;
          }

          &.time {
            background: #e3f2fd;
            color: #0d47a1;
            
            small {
              font-size: 10px;
              margin-left: 2px;
            }
          }
        }

        .mat-column-position {
          width: 50px;
          text-align: center;
        }

        .mat-column-completed,
        .mat-column-avgTime {
          width: 120px;
          text-align: center;
        }
      }

      .no-data-row {
        height: 60px;
        
        .mat-cell {
          text-align: center;
          color: #999;
          font-style: italic;
        }
      }
    }
  `]
})
export class TopTechniciansComponent {
  @Input() data: TechnicianPerformance[] = [];
  displayedColumns: string[] = ['position', 'technician', 'completed', 'avgTime'];
}