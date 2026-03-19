import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { EquipmentFailure } from '../../../../../../core/interfaces/dashboard.interface';

@Component({
  selector: 'app-top-failures',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="failures-container">
      <table mat-table [dataSource]="data" class="failures-table">
        <!-- Equipo -->
        <ng-container matColumnDef="equipment">
          <th mat-header-cell *matHeaderCellDef>Equipo</th>
          <td mat-cell *matCellDef="let failure">
            <div class="equipment-info">
              <mat-icon>devices</mat-icon>
              <div class="details">
                <strong>{{ failure.serialNumber }}</strong>
                <small>{{ failure.model }}</small>
              </div>
            </div>
          </td>
        </ng-container>

        <!-- Fallas -->
        <ng-container matColumnDef="failures">
          <th mat-header-cell *matHeaderCellDef>Fallas</th>
          <td mat-cell *matCellDef="let failure">
            <span class="badge failure">{{ failure.failureCount }}</span>
          </td>
        </ng-container>

        <!-- Última Falla -->
        <ng-container matColumnDef="lastFailure">
          <th mat-header-cell *matHeaderCellDef>Última Falla</th>
          <td mat-cell *matCellDef="let failure">
            <span class="date-badge">
              <mat-icon>event</mat-icon>
              {{ failure.lastFailureDate | date:'dd/MM/yyyy' }}
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <tr class="mat-row no-data-row" *matNoDataRow>
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">
            No hay datos de fallas disponibles
          </td>
        </tr>
      </table>
    </div>
  `,
  styles: [`
    .failures-container {
      .failures-table {
        width: 100%;

        .equipment-info {
          display: flex;
          align-items: center;
          gap: 12px;

          mat-icon {
            color: #b71c1c;
            font-size: 20px;
          }

          .details {
            display: flex;
            flex-direction: column;

            strong {
              font-size: 14px;
            }

            small {
              font-size: 11px;
              color: #666;
            }
          }
        }

        .badge {
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;

          &.failure {
            background: #ffebee;
            color: #b71c1c;
          }
        }

        .date-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 16px;
          font-size: 12px;
          
          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }

        .mat-column-equipment {
          min-width: 200px;
        }

        .mat-column-failures {
          width: 100px;
          text-align: center;
        }

        .mat-column-lastFailure {
          width: 150px;
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
export class TopFailuresComponent {
  @Input() data: EquipmentFailure[] = [];
  displayedColumns: string[] = ['equipment', 'failures', 'lastFailure'];
}