import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './pie-chart.component.html',})
  
export class PieChartComponent {
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Sur Oriental', 'Central', 'Occidental', 'Norte Oriental'],
    datasets: [
      {
        data: [600, 90, 100, 200],
        backgroundColor: ['#3f51b5', '#ff4081', '#4caf50', '#ff9800']
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Disponibilidad Técnica por región' }
    }
  };
}
