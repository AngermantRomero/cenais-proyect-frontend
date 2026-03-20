import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairService } from '../../../../../../core/services/repair.service';
import { Repair } from '../../../../../../core/interfaces/repair.interface';

@Component({
  selector: 'app-top-failures',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-failures.component.html',
  styleUrls: ['./top-failures.component.scss']
})
export class TopFailuresComponent implements OnInit, OnChanges {
  @Input() filtersApplied: boolean = false;
  @Input() siteId: string = '';
  @Input() typeId: string = '';
  @Input() statusId: string = '';
  
  failures: {
    equipmentId: string;
    serialNumber: string;
    model: string;
    failureCount: number;
    lastFailureDate: string;
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
    
    const filters: any = {};
    if (this.siteId) filters.siteId = this.siteId;
    if (this.typeId) filters.typeId = this.typeId;
    if (this.statusId) filters.statusId = this.statusId;
    
    console.log('⚠️ Cargando fallas con filtros:', filters);
    
    this.repairService.getRepairs(filters).subscribe({
      next: (reparaciones) => {
        this.processFailuresData(reparaciones);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading repairs:', err);
        this.loadSampleData();
        this.isLoading = false;
      }
    });
  }

  private processFailuresData(reparaciones: Repair[]): void {
    // Agrupar reparaciones por equipo
    const equipmentMap = new Map<string, {
      equipmentId: string;
      serialNumber: string;
      model: string;
      failureCount: number;
      lastFailureDate: Date | null;
    }>();
    
    reparaciones.forEach(rep => {
      const equipId = rep.equipmentId;
      const equipment = rep.equipment;
      const modelName = equipment?.model?.modelName || 'N/A';
      const serial = equipment?.serialNumber || 'N/A';
      
      if (!equipmentMap.has(equipId)) {
        equipmentMap.set(equipId, {
          equipmentId: equipId,
          serialNumber: serial,
          model: modelName,
          failureCount: 0,
          lastFailureDate: null
        });
      }
      
      const equip = equipmentMap.get(equipId)!;
      equip.failureCount++;
      
      // Actualizar última fecha de falla
      if (rep.createdAt) {
        const repDate = new Date(rep.createdAt);
        if (!equip.lastFailureDate || repDate > equip.lastFailureDate) {
          equip.lastFailureDate = repDate;
        }
      }
    });
    
    // Convertir a array y ordenar
    this.failures = Array.from(equipmentMap.values())
      .sort((a, b) => b.failureCount - a.failureCount)
      .slice(0, 5) // Top 5
      .map(f => ({
        ...f,
        lastFailureDate: f.lastFailureDate 
          ? f.lastFailureDate.toLocaleDateString('es-ES')
          : 'N/A'
      }));
    
    console.log('⚠️ Top fallas:', this.failures);
  }

  private loadSampleData(): void {
    this.failures = [
      { equipmentId: '1', serialNumber: 'SN-001', model: 'Corolla', failureCount: 5, lastFailureDate: '01/03/2026' },
      { equipmentId: '2', serialNumber: 'SN-002', model: 'Yaris', failureCount: 3, lastFailureDate: '28/02/2026' },
      { equipmentId: '3', serialNumber: 'SN-003', model: 'Hilux', failureCount: 2, lastFailureDate: '05/03/2026' }
    ];
  }
}