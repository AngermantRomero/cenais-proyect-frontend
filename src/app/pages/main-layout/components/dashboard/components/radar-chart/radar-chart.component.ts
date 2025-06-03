import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-radar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './radar-chart.component.html',
})
export class RadarChartComponent {
  radarChartData: ChartConfiguration<'radar'>['data'] = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        data: [5,8, 3, 6, 7,1],
        label: 'Visitas',
        backgroundColor: 'rgba(63,81,181,0.2)',
        borderColor: '#3f51b5',
        pointBackgroundColor: '#3f51b5'
      }
    ]
  };

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Visitas por Averias/Mantenimiento' }
    }
  };
}

