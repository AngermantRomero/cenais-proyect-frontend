import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { MonthlyRepairs } from '../../../../../../core/interfaces/dashboard.interface';

echarts.use([BarChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

@Component({
  selector: 'app-monthly-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    <div echarts [options]="chartOptions" class="chart-container"></div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 200px;
    }
  `]
})
export class MonthlyChartComponent implements OnInit {
  @Input() set data(value: MonthlyRepairs[] | null) {
    if (value && value.length > 0) {
      console.log('📊 Datos para gráfico mensual:', value);
      this.chartData = value;
      this.updateChartOptions();
    } else {
      this.setDefaultData();
    }
  }

  chartData: MonthlyRepairs[] = [];
  chartOptions: EChartsCoreOption = {};

  ngOnInit(): void {
    if (this.chartData.length === 0) {
      this.setDefaultData();
    } else {
      this.initializeChartOptions();
      this.updateChartOptions();
    }
  }

  private setDefaultData(): void {
    this.chartData = [
      { month: '01', year: 2026, completed: 12, pending: 5, inProgress: 3 },
      { month: '02', year: 2026, completed: 15, pending: 4, inProgress: 6 },
      { month: '03', year: 2026, completed: 18, pending: 7, inProgress: 4 }
    ];
    this.initializeChartOptions();
    this.updateChartOptions();
  }

  private initializeChartOptions(): void {
    this.chartOptions = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Completadas', 'En progreso', 'Pendientes'],
        bottom: 0,
        left: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: { fontSize: 10 }
      },
      grid: {
        left: '8%',
        right: '5%',
        bottom: '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: [],
        axisLabel: {
          fontSize: 9,
          rotate: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Cantidad',
        nameTextStyle: { fontSize: 9 },
        axisLabel: { fontSize: 9 },
        splitLine: { lineStyle: { color: '#f0f0f0' } }
      },
      series: [
        {
          name: 'Completadas',
          type: 'bar',
          data: [],
          itemStyle: { color: '#1b5e20' },
          barWidth: 8
        },
        {
          name: 'En progreso',
          type: 'bar',
          data: [],
          itemStyle: { color: '#0d47a1' },
          barWidth: 8
        },
        {
          name: 'Pendientes',
          type: 'bar',
          data: [],
          itemStyle: { color: '#e65100' },
          barWidth: 8
        }
      ]
    };
  }

  private updateChartOptions(): void {
    if (!this.chartData || this.chartData.length === 0) {
      console.warn('⚠️ No hay datos para actualizar el gráfico');
      return;
    }

    const months = this.chartData.map(item => {
      const date = new Date(item.year, parseInt(item.month) - 1);
      return date.toLocaleDateString('es-ES', { month: 'short' });
    });

    const completedData = this.chartData.map(item => item.completed);
    const inProgressData = this.chartData.map(item => item.inProgress);
    const pendingData = this.chartData.map(item => item.pending);

    // Crear copia profunda del objeto para evitar referencias
    const options = JSON.parse(JSON.stringify(this.chartOptions));
    
    // ✅ VERIFICAR QUE LAS PROPIEDADES EXISTEN ANTES DE ASIGNAR
    if (options.xAxis) {
      options.xAxis.data = months;
    } else {
      console.error('❌ xAxis no está definido en chartOptions');
    }
    
    if (options.series && options.series.length >= 3) {
      options.series[0].data = completedData;
      options.series[1].data = inProgressData;
      options.series[2].data = pendingData;
    } else {
      console.error('❌ series no está definido correctamente en chartOptions');
    }

    this.chartOptions = options;
    console.log('✅ Gráfico actualizado:', this.chartOptions);
  }
}