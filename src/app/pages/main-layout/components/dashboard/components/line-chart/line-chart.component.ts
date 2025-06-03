import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  styleUrls: ['./line-chart.component.scss'],
  templateUrl: './line-chart.component.html',
})

export class LineChartComponent {
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [10, 12, 15, 8, 16, 17],
        label: 'Averias',
        fill: true,
        tension: 0.4,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,0.3)'
      }
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    
    plugins: {
      title: { display: true, text: 'Averias mensuales' } 
    }
  };
}