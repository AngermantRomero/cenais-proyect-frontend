import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairService } from '../../../../../../core/services/repair.service';
import { Repair } from '../../../../../../core/interfaces/repair.interface';

@Component({
  selector: 'app-top-technicians',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-technicians.component.html',
  styleUrls: ['./top-technicians.component.scss']
})
export class TopTechniciansComponent implements OnInit, OnChanges {
  @Input() filtersApplied: boolean = false;
  @Input() siteId: string = '';
  @Input() typeId: string = '';
  @Input() statusId: string = '';
  
  technicians: {
    id: string;
    name: string;
    completedRepairs: number;
    avgRepairTime: number;
  }[] = [];
  
  isLoading: boolean = false;

  constructor(private repairService: RepairService) {}

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
    
    // Construir filtros
    const filters: any = {};
    if (this.siteId) filters.siteId = this.siteId;
    if (this.typeId) filters.typeId = this.typeId;
    if (this.statusId) filters.statusId = this.statusId;
    
    console.log('👥 Cargando técnicos con filtros:', filters);
    
    this.repairService.getRepairs(filters).subscribe({
      next: (reparaciones) => {
        this.processTechniciansData(reparaciones);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading repairs:', err);
        this.loadSampleData();
        this.isLoading = false;
      }
    });
  }

  private processTechniciansData(reparaciones: Repair[]): void {
    // Filtrar solo reparaciones completadas
    const completedRepairs = reparaciones.filter(r => r.status === 'completed');
    
    // Agrupar por técnico
    const techMap = new Map<string, {
      id: string;
      name: string;
      completedRepairs: number;
      totalTime: number;
    }>();
    
    completedRepairs.forEach(rep => {
      const techId = rep.technicianId || rep.technician?.id;
      if (!techId) return;
      
      const techName = rep.technician 
        ? `${rep.technician.name}`.trim()
        : 'Desconocido';
      
      if (!techMap.has(techId)) {
        techMap.set(techId, {
          id: techId,
          name: techName,
          completedRepairs: 0,
          totalTime: 0
        });
      }
      
      const tech = techMap.get(techId)!;
      tech.completedRepairs++;
      
      // Calcular tiempo si existe startDate y endDate
      if (rep.startDate && rep.endDate) {
        const start = new Date(rep.startDate);
        const end = new Date(rep.endDate);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        tech.totalTime += hours;
      }
    });
    
    // Convertir a array y calcular promedio
    this.technicians = Array.from(techMap.values())
      .map(tech => ({
        ...tech,
        avgRepairTime: tech.completedRepairs > 0 
          ? Math.round((tech.totalTime / tech.completedRepairs) * 100) / 100 
          : 0
      }))
      .sort((a, b) => b.completedRepairs - a.completedRepairs)
      .slice(0, 5); // Top 5
    
    console.log('👥 Top técnicos:', this.technicians);
  }

  private loadSampleData(): void {
    this.technicians = [
      { id: '1', name: 'Juan Pérez', completedRepairs: 28, avgRepairTime: 18.5 },
      { id: '2', name: 'María García', completedRepairs: 24, avgRepairTime: 22.3 },
      { id: '3', name: 'Carlos López', completedRepairs: 19, avgRepairTime: 25.1 }
    ];
  }
}