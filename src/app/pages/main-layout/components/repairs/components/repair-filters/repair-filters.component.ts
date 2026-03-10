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
import { RepairFilter } from '../../../../../../core/interfaces/repair.interface';
import { EquipmentService } from '../../../../../../core/services/equipement.service';
import { UserService } from '../../../../../../core/services/user.service'; // 👈 IMPORTAR
import { User } from '../../../../../../core/interfaces/user.interface'; // 👈 IMPORTAR
import  moment from 'moment';
@Component({
  selector: 'app-repair-filters',
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
  templateUrl: './repair-filters.component.html',
  styleUrls: ['./repair-filters.component.scss']
})
export class RepairFiltersComponent implements OnInit {
  @Output() filterChange = new EventEmitter<RepairFilter>();
  
  filter: RepairFilter = {};
  equipments: any[] = [];
  technicians: User[] = []; // 👈 NUEVO
  statuses = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' }
  ];

  constructor(
    private equipmentService: EquipmentService,
    private userService: UserService // 👈 INYECTAR
  ) {}

  ngOnInit(): void {
    this.loadEquipments();
    this.loadTechnicians(); // 👈 CARGAR TÉCNICOS
  }

  loadEquipments(): void {
    this.equipmentService.getEquipments().subscribe({
      next: (equipments) => {
        this.equipments = equipments;
      },
      error: (err) => console.error('Error loading equipments:', err)
    });
  }

  // 👇 NUEVO: Cargar técnicos
  loadTechnicians(): void {
    this.userService.getTechnicians().subscribe({
      next: (response) => {
        this.technicians = response.data;
      },
      error: (err) => console.error('Error loading technicians:', err)
    });
  }

  applyFilters(): void {
    // Limpiar filtros vacíos
    const cleanFilter: any = {};
    
    if (this.filter.equipmentId) cleanFilter.equipmentId = this.filter.equipmentId;
    if (this.filter.technicianId) cleanFilter.technicianId = this.filter.technicianId;
    if (this.filter.status) cleanFilter.status = this.filter.status;
    
    // Formatear fechas si existen
    if (this.filter.startDate) {
       cleanFilter.startDate = moment(this.filter.startDate).format('YYYY-MM-DD');
    console.log('📅 Fecha desde original:', this.filter.endDate);
    console.log('📅 Fecha desde formateada:', cleanFilter.startDate);
    }
    if (this.filter.endDate) {
      cleanFilter.startDateTo = moment(this.filter.startDate).format('YYYY-MM-DD');
    }
    
    console.log('🔍 Aplicando filtros:', cleanFilter); // Para depurar
    this.filterChange.emit(cleanFilter);
  }

  clearFilters(): void {
    this.filter = {
        
    };
    this.filterChange.emit({});
  }
}