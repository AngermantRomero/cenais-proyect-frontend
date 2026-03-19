import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="kpi-card" [class]="color">
      <mat-card-content>
        <div class="kpi-content">
          <div class="kpi-info">
            <div class="kpi-icon">
              <mat-icon>{{ icon }}</mat-icon>
            </div>
            <div class="kpi-value">{{ value }}{{ unit ? unit : '' }}</div>
            <div class="kpi-title">{{ title }}</div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
      
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      }

      &.primary { background: #800020; color: white; }
      &.success { background: #1b5e20; color: white; }
      &.warning { background: #e65100; color: white; }
      &.info { background: #0d47a1; color: white; }
      &.danger { background: #b71c1c; color: white; }
      
      .kpi-content {
        padding: 16px;
      }

      .kpi-icon {
        margin-bottom: 12px;
        
        mat-icon {
          font-size: 32px;
          width: 32px;
          height: 32px;
        }
      }

      .kpi-value {
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .kpi-title {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  `]
})
export class KpiCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() unit: string = '';
  @Input() icon: string = '';
  @Input() color: 'primary' | 'success' | 'warning' | 'info' | 'danger'= 'primary';
}