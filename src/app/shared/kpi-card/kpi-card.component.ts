import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="kpi-card">
      <div class="kpi-title">{{ title }}</div>
      <div class="kpi-value">{{ value }}</div>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      padding: 1rem;
      text-align: center;
    }
    .kpi-title {
      font-size: 1rem;
      color: #555;
    }
    .kpi-value {
      font-size: 1.8rem;
      font-weight: bold;
      color: #2e7d32;
    }
  `]
})
export class KpiCardComponent {
  @Input() title!: string;
  @Input() value!: string | number;
}
