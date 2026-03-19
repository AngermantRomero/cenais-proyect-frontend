import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DashboardFilters } from '../../../../../../core/interfaces/dashboard.interface';
import { EquipmentService } from '../../../../../../core/services/equipement.service';
import { SiteService } from '../../../../../../core/services/site.service';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './dashboard-filters.component.html',
  styleUrls: ['./dashboard-filters.component.scss']
})
export class DashboardFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<DashboardFilters>();
  
  filters: DashboardFilters = {};
  
  sites: any[] = [];
  equipmentTypes: any[] = [];
  technicians: any[] = [];
  statuses = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  constructor(
    private equipmentService: EquipmentService,
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.loadSites();
    this.loadEquipmentTypes();
    this.loadTechnicians();
  }

  loadSites(): void {
    this.siteService.getSites().subscribe({
      next: (response) => {
        this.sites = response.data;
      },
      error: (err) => console.error('Error loading sites:', err)
    });
  }

  loadEquipmentTypes(): void {
    this.equipmentService.getEquipmentTypes().subscribe({
      next: (types) => {
        this.equipmentTypes = types;
      },
      error: (err) => console.error('Error loading equipment types:', err)
    });
  }

  loadTechnicians(): void {
    // Asumiendo que tienes un servicio para obtener técnicos
    // this.technicianService.getTechnicians().subscribe(...)
    // Por ahora, datos de ejemplo
    this.technicians = [
      { id: '1', name: 'Juan Pérez' },
      { id: '2', name: 'María García' },
      { id: '3', name: 'Carlos López' }
    ];
  }

  applyFilters(): void {
    const cleanFilters: DashboardFilters = {};
    
    if (this.filters.startDate) cleanFilters.startDate = this.filters.startDate;
    if (this.filters.endDate) cleanFilters.endDate = this.filters.endDate;
    if (this.filters.siteId) cleanFilters.siteId = this.filters.siteId;
    if (this.filters.equipmentTypeId) cleanFilters.equipmentTypeId = this.filters.equipmentTypeId;
    if (this.filters.technicianId) cleanFilters.technicianId = this.filters.technicianId;
    if (this.filters.equipmentStatusId) cleanFilters.equipmentStatusId = this.filters.equipmentStatusId;
    
    this.filterChange.emit(cleanFilters);
  }

  clearFilters(): void {
    this.filters = {};
    this.filterChange.emit({});
  }
}