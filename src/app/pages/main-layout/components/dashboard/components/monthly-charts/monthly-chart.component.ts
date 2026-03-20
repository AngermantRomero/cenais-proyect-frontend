import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RepairService } from '../../../../../../core/services/repair.service';


interface MonthData {
  year: number;
  month: number;
  name: string;
  count: number;
}

@Component({
  selector: 'app-monthly-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './monthly-chart.component.html',
  styleUrls: ['./monthly-chart.component.scss']
})
export class MonthlyChartComponent implements OnInit, OnChanges {
  @Input() siteId: string = '';
  @Input() typeId: string = '';
  @Input() statusId: string = '';
  @Input() filtersApplied: boolean = false;
  
  // Datos del gráfico
  months: string[] = [];
  totals: number[] = [];
  maxValue: number = 10;
  
  private monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  constructor(private repairService: RepairService) {}

  ngOnInit() {
    this.loadData();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['siteId'] || changes['typeId'] || changes['statusId'] || changes['filtersApplied']) {
      if (this.filtersApplied) {
        this.loadData();
      } else {
        this.clearData();
      }
    }
  }

  private loadData(): void {
    const filters: any = {};
    
    if (this.siteId) filters.siteId = this.siteId;
    if (this.typeId) filters.typeId = this.typeId;
    if (this.statusId) filters.statusId = this.statusId;
    
    console.log('📊 Cargando reparaciones con filtros:', filters);
    
    this.repairService.getRepairs(filters).subscribe({
      next: (reparaciones) => {
        console.log('📊 Reparaciones recibidas:', reparaciones.length);
        this.processRepairsByMonth(reparaciones);
      },
      error: (err) => {
        console.error('Error cargando reparaciones:', err);
        this.setSampleData();
      }
    });
  }

  private processRepairsByMonth(reparaciones: any[]): void {
    const today = new Date();
    const monthsData: MonthData[] = []; // <-- AHORA CON TIPO DEFINIDO
    
    // Generar array con los últimos 4 meses
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsData.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: this.monthNames[date.getMonth()],
        count: 0
      });
    }
    
    // Contar reparaciones por mes
    reparaciones.forEach(rep => {
      if (rep.createdAt) {
        const repDate = new Date(rep.createdAt);
        const repYear = repDate.getFullYear();
        const repMonth = repDate.getMonth() + 1;
        
        const monthData = monthsData.find(m => m.year === repYear && m.month === repMonth);
        if (monthData) {
          monthData.count++;
        }
      }
    });
    
    this.months = monthsData.map(m => m.name);
    this.totals = monthsData.map(m => m.count);
    this.maxValue = Math.max(...this.totals, 5);
    
    console.log('📊 Meses:', this.months);
    console.log('📊 Totales:', this.totals);
  }

  private clearData(): void {
    const today = new Date();
    const monthsData: MonthData[] = [];
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsData.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: this.monthNames[date.getMonth()],
        count: 0
      });
    }
    
    this.months = monthsData.map(m => m.name);
    this.totals = [0, 0, 0, 0];
    this.maxValue = 5;
  }

  private setSampleData(): void {
    const today = new Date();
    const monthsData: MonthData[] = [];
    
    for (let i = 3; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthsData.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        name: this.monthNames[date.getMonth()],
        count: Math.floor(Math.random() * 8) + 1 // Datos aleatorios para ejemplo
      });
    }
    
    this.months = monthsData.map(m => m.name);
    this.totals = monthsData.map(m => m.count);
    this.maxValue = Math.max(...this.totals, 5);
  }

  getBarHeight(value: number): string {
    if (this.maxValue === 0) return '20px';
    const percentage = (value / this.maxValue) * 100;
    return `${Math.max(20, Math.min(180, percentage * 1.5))}px`;
  }
  
  getGridValue(index: number): number {
    const values = [
      this.maxValue, 
      Math.round(this.maxValue * 0.75), 
      Math.round(this.maxValue * 0.5), 
      Math.round(this.maxValue * 0.25), 
      0
    ];
    return values[index];
  }
}