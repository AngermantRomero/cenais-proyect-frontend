import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatCardModule],
  styleUrls: ['./bar-chart.component.scss'],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['CHIV', 'HLG', 'CCCC', 'SAB'],
    datasets: [
      { data: [120, 150, 180, 90], label: 'Averias por Estaciones', backgroundColor: '#4caf50' }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Estaciones con más averias' }
    }
  };
}
