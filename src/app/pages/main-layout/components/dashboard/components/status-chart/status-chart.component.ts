import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { EquipmentService } from '../../../../../../core/services/equipement.service';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss']
})
export class StatusChartComponent implements OnInit, OnChanges {
  @Input() siteId: string = '';
  @Input() typeId: string = '';
  @Input() statusId: string = '';
  @Input() filtersApplied: boolean = false;
  
  statuses: { label: string; value: number; color: string; percentage: number }[] = [];
  total: number = 0;
  isLoading: boolean = false;

  private statusColors: { [key: string]: string } = {
    'Operacional': '#4caf50',
    'En reparación': '#ff9800',
    'Mantenimiento': '#2196f3',
    'De baja': '#9e9e9e',
    'Dañado': '#f44336',
    'default': '#800020'
  };

  constructor(private equipmentService: EquipmentService) {}

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.filtersApplied) {
      this.loadData();
    }
  }

  private loadData(): void {
    this.isLoading = true;
    
    const filters: any = {};
    if (this.siteId) filters.siteId = this.siteId;
    if (this.typeId) filters.typeId = this.typeId;
    if (this.statusId) filters.statusId = this.statusId;
    
    this.equipmentService.getEquipmentsFiltered(filters).subscribe({
      next: (equipos) => {
        this.processEquipmentData(equipos);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando equipos:', err);
        this.loadSampleData();
        this.isLoading = false;
      }
    });
  }

  private processEquipmentData(equipos: any[]): void {
    const statusCount = new Map<string, number>();
    
    equipos.forEach(equipo => {
      const stateName = equipo.currentState?.name || 'Sin estado';
      statusCount.set(stateName, (statusCount.get(stateName) || 0) + 1);
    });
    
    this.total = equipos.length;
    
    this.statuses = Array.from(statusCount.entries())
      .map(([label, value]) => ({
        label,
        value,
        color: this.statusColors[label] || this.statusColors['default'],
        percentage: this.total > 0 ? Math.round((value / this.total) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);
  }

  // NUEVO MÉTODO: Genera el path para cada segmento del donut
  getSlicePath(index: number): string {
    if (this.statuses.length === 0) return '';
    
    // Calcular ángulo inicial y final para este segmento
    let startAngle = 0;
    for (let i = 0; i < index; i++) {
      startAngle += (this.statuses[i].percentage / 100) * 360;
    }
    
    const endAngle = startAngle + (this.statuses[index].percentage / 100) * 360;
    
    // Convertir ángulos a radianes
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Radio exterior e interior
    const outerRadius = 40;
    const innerRadius = 28;
    
    // Centro
    const cx = 50;
    const cy = 50;
    
    // Puntos del arco exterior
    const startXOuter = cx + outerRadius * Math.cos(startRad);
    const startYOuter = cy + outerRadius * Math.sin(startRad);
    const endXOuter = cx + outerRadius * Math.cos(endRad);
    const endYOuter = cy + outerRadius * Math.sin(endRad);
    
    // Puntos del arco interior
    const startXInner = cx + innerRadius * Math.cos(startRad);
    const startYInner = cy + innerRadius * Math.sin(startRad);
    const endXInner = cx + innerRadius * Math.cos(endRad);
    const endYInner = cy + innerRadius * Math.sin(endRad);
    
    // Flag para arco grande (si es más de 180 grados)
    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
    
    // Construir el path
    return `
      M ${startXOuter} ${startYOuter}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endXOuter} ${endYOuter}
      L ${endXInner} ${endYInner}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${startXInner} ${startYInner}
      Z
    `;
  }

  private loadSampleData(): void {
    this.total = 4;
    this.statuses = [
      { label: 'Operacional', value: 2, color: '#4caf50', percentage: 50 },
      { label: 'En reparación', value: 1, color: '#ff9800', percentage: 25 },
      { label: 'Dañado', value: 1, color: '#f44336', percentage: 25 }
    ];
  }
}