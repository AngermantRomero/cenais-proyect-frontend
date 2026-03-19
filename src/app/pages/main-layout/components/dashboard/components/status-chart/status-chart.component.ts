import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components'; // 👈 QUITAR GraphicComponent
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { EquipmentStatus } from '../../../../../../core/interfaces/dashboard.interface';

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-status-chart',
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
export class StatusChartComponent implements OnInit {
  @Input() set data(value: EquipmentStatus | null) {
    if (value && (value.operational > 0 || value.inRepair > 0 || value.retired > 0 || value.maintenance > 0)) {
      console.log('🥧 Datos para gráfico de estado:', value);
      this.statusData = value;
      this.updateChartOptions();
    } else {
      this.setDefaultData();
    }
  }

  statusData: EquipmentStatus = {
    operational: 0,
    inRepair: 0,
    retired: 0,
    maintenance: 0
  };

  chartOptions: EChartsCoreOption = {};

  ngOnInit(): void {
    if (this.statusData.operational === 0 && 
        this.statusData.inRepair === 0 && 
        this.statusData.retired === 0 && 
        this.statusData.maintenance === 0) {
      this.setDefaultData();
    } else {
      this.initializeChartOptions();
      this.updateChartOptions();
    }
  }

  private setDefaultData(): void {
    this.statusData = {
      operational: 45,
      inRepair: 8,
      retired: 3,
      maintenance: 4
    };
    this.initializeChartOptions();
    this.updateChartOptions();
  }

  private initializeChartOptions(): void {
    const total = this.getTotal();
    
    this.chartOptions = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 50, 
        itemGap: 12,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { 
          fontSize: 11,
          fontWeight: 'normal'
        },
        formatter: (name: string) => {
          const data = this.getDataArray();
          const item = data.find(d => d.name === name);
          return `${name}: ${item?.value || 0}`;
        }
      },
      title: {
        text: `Total: ${total}`,
        left: 'right',
        top: 10,
        textStyle: {
          color: '#800020',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '65%'],
          center: ['35%', '55%'],
          avoidLabelOverlap: true,
          label: { show: false },
          emphasis: {
            scale: true,
            label: { 
              show: true, 
              fontSize: 11,
              fontWeight: 'bold'
            }
          },
          data: this.getDataArray()
        }
      ]
    };
  }

  private getDataArray(): any[] {
    return [
      { value: this.statusData.operational, name: 'Operacional', itemStyle: { color: '#1b5e20' } },
      { value: this.statusData.inRepair, name: 'En reparación', itemStyle: { color: '#e65100' } },
      { value: this.statusData.maintenance, name: 'Mantenimiento', itemStyle: { color: '#0d47a1' } },
      { value: this.statusData.retired, name: 'De baja', itemStyle: { color: '#b71c1c' } }
    ];
  }

  private getTotal(): number {
    return this.statusData.operational +
           this.statusData.inRepair +
           this.statusData.retired +
           this.statusData.maintenance;
  }

  private updateChartOptions(): void {
    if (!this.statusData) {
      console.warn('⚠️ No hay datos de estado para actualizar el gráfico');
      return;
    }

    const total = this.getTotal();
    const data = this.getDataArray();
    
    // Crear copia profunda del objeto para evitar referencias
    const options = JSON.parse(JSON.stringify(this.chartOptions));
    
    // ✅ ACTUALIZAR DATOS DE LA SERIE
    if (options.series && options.series[0]) {
      options.series[0].data = data;
    }
    
    // ✅ ACTUALIZAR TÍTULO (TOTAL)
    if (options.title) {
      options.title.text = `Total: ${total}`;
    }

    this.chartOptions = options;
  }
}