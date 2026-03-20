import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { EquipmentService } from '../../../../../../core/services/equipement.service';

@Component({
  selector: 'app-filter-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule
  ],
  templateUrl: './filter-results.component.html',
  styleUrls: ['./filter-results.component.scss']
})
export class FilterResultsComponent implements OnChanges {
  @Input() selectedSiteId: string = '';
  @Input() selectedTypeId: string = '';
  @Input() selectedStatusId: string = '';
  @Input() filtersApplied: boolean = false;
  
  // Datos agregados
  totalEquipos: number = 0;
  
  // Resultados por sitio
  sitiosData: { nombre: string; code: string; count: number }[] = [];
  
  // Resultados por tipo
  tiposData: { nombre: string; count: number }[] = [];
  
  // Resultados por estado
  estadosData: { nombre: string; count: number; color: string }[] = [];
  
  // Para controlar el panel expandido
  panelOpenState: boolean = true;

  constructor(private equipmentService: EquipmentService) {}

  ngOnChanges(changes: SimpleChanges): void {
   if (this.filtersApplied && (changes['selectedSiteId'] || changes['selectedTypeId'] || changes['selectedStatusId'])) {
      this.loadFilteredData();
    }
  }

  private loadFilteredData(): void {
    // Mostrar spinner si quieres
    this.equipmentService.getEquipments().subscribe({
      next: (equipos) => {
        // Aplicar filtros
        const equiposFiltrados = this.applyFilters(equipos);
        
        this.totalEquipos = equiposFiltrados.length;
        this.sitiosData = this.groupBySite(equiposFiltrados);
        this.tiposData = this.groupByType(equiposFiltrados);
        this.estadosData = this.groupByState(equiposFiltrados);
      },
      error: (err) => {
        console.error('Error loading equipment:', err);
        this.loadSampleData(); // Para pruebas
      }
    });
  }

  private applyFilters(equipos: any[]): any[] {
    let filtered = [...equipos];

    if (this.selectedSiteId) {
      filtered = filtered.filter(e => e.site?.id === this.selectedSiteId);
    }

    if (this.selectedTypeId) {
      filtered = filtered.filter(e => e.typeEquipement?.id === this.selectedTypeId);
    }

    if (this.selectedStatusId) {
      filtered = filtered.filter(e => e.currentState?.id === this.selectedStatusId);
    }

    return filtered;
  }

  // Los mismos métodos de agrupación que te compartí antes
  private groupBySite(equipos: any[]): any[] {
    const groups = new Map();
    
    equipos.forEach(e => {
      const siteId = e.site?.id || 'sin-sitio';
      const siteName = e.site ? `${e.site.code} - ${e.site.locality}` : 'Sin sitio asignado';
      const siteCode = e.site?.code || 'N/A';
      
      if (!groups.has(siteId)) {
        groups.set(siteId, { 
          nombre: siteName, 
          code: siteCode, 
          count: 0 
        });
      }
      groups.get(siteId).count++;
    });

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }

  private groupByType(equipos: any[]): any[] {
    const groups = new Map();
    
    equipos.forEach(e => {
      const typeId = e.typeEquipement?.id || 'sin-tipo';
      const typeName = e.typeEquipement?.name || 'Sin tipo';
      
      if (!groups.has(typeId)) {
        groups.set(typeId, { nombre: typeName, count: 0 });
      }
      groups.get(typeId).count++;
    });

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }

  private groupByState(equipos: any[]): any[] {
    const groups = new Map();
    const colors = {
      'operacional': '#4caf50',
      'en reparación': '#ff9800',
      'mantenimiento': '#2196f3',
      'de baja': '#f44336',
      'default': '#9e9e9e'
    };
    
    equipos.forEach(e => {
      const stateId = e.currentState?.id || 'sin-estado';
      const stateName = e.currentState?.name || 'Sin estado';
      const stateLower = stateName.toLowerCase();
      
      if (!groups.has(stateId)) {
        groups.set(stateId, { 
          nombre: stateName, 
          count: 0,
          color: colors[stateLower as keyof typeof colors] || colors.default
        });
      }
      groups.get(stateId).count++;
    });

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }

  private loadSampleData(): void {
    this.totalEquipos = 3;
    this.sitiosData = [
      { nombre: 'chiv - chivirico', code: 'chiv', count: 2 },
      { nombre: 'MGV - Manicaragua', code: 'MGV', count: 1 }
    ];
    this.tiposData = [
      { nombre: 'Digitalizador', count: 2 },
      { nombre: 'Batería', count: 1 }
    ];
    this.estadosData = [
      { nombre: 'Operacional', count: 2, color: '#4caf50' },
      { nombre: 'Dañado', count: 1, color: '#f44336' }
    ];
  }
}