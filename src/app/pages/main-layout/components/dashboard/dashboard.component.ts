import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SiteService } from '../../../../core/services/site.service';
import { EquipmentService } from '../../../../core/services/equipement.service'; 
import { UserService } from '../../../../core/services/user.service'; 
import { DashboardData, DashboardFilters } from '../../../../core/interfaces/dashboard.interface';
import { DashboardFiltersComponent } from './components/filters/dashboard-filters.component';
import { MonthlyChartComponent } from './components/monthly-charts/monthly-chart.component';
import { StatusChartComponent } from './components/status-chart/status-chart.component';
import { TopTechniciansComponent } from './components/top-technicians/top-technicians.component';
import { TopFailuresComponent } from './components/top-failures/top-failures.component';
import { KpiCardComponent } from '../../../../shared/kpi-card/kpi-card.component';
import { SafeNumberPipe } from '../../../../shared/pipes/safe-number.pipe';
import { TypeEquipement } from '../../../../core/interfaces/equipement.interface';
import { Site } from '../../../../core/interfaces/sites.interface';
import { User } from '../../../../core/interfaces/user.interface';
import { ArrayResponse } from '../../../../core/interfaces/http.responses.interface';
import { EquipmentState } from '../../../../core/interfaces/equipement.interface';
import { EquipmentStatusSelectorDialogComponent } from './components/dialogs/equipment-status-selector.dialog';
import { FilterResultsComponent } from './components/filters-result/filter-results.component';
// Importaciones de diálogos
import { SiteSelectorDialogComponent } from './components/dialogs/site-selector.dialog';
import { TypeSelectorDialogComponent } from './components/dialogs/type-selector.dialog';
import { StatusSelectorDialogComponent } from './components/dialogs/status-selector.dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MonthlyChartComponent,
    StatusChartComponent,
    TopTechniciansComponent,
    TopFailuresComponent,
    FilterResultsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  userRole: string = '';
  currentDate: Date = new Date();
  activeTab: 'charts' | 'tables' | 'map' = 'charts';
  equipmentStates: EquipmentState[] = [];
  filtersApplied: boolean = false;

  

  // NUEVO: Para el componente filter-results
  selectedSiteId: string = '';
  selectedTypeId: string = '';
  selectedEquipmentStatusId: string = '';
  
  // Filtros (sin fechas)
  filters: DashboardFilters = {
    siteId: '',
    equipmentTypeId: '',
    technicianId: '',
    equipmentStatusId:'',
  };
  
  // Nombres para mostrar en chips
  selectedSiteName: string = '';
  selectedTypeName: string = '';
  selectedTechnicianName: string = '';
  selectedStatusLabel: string = '';
  
  // Datos para filtros
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
    private dashboardService: DashboardService,
    private authService: AuthService,
    private siteService: SiteService,
    private equipmentService: EquipmentService,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserData()?.role?.name || 'Guest';
    this.loadFiltersData();
    this.loadEquipmentStates();
    this.loadDashboardData();
    
    setInterval(() => {
      this.currentDate = new Date();
    }, 60000);
  }
    loadEquipmentStates(): void {
    this.equipmentService.getEquipmentStates().subscribe({
      next: (response: EquipmentState[] | ArrayResponse<EquipmentState>) => {
        if (Array.isArray(response)) {
          this.equipmentStates = response;
        } else {
          this.equipmentStates = response.data;
        }
        console.log('📊 Estados de equipos cargados:', this.equipmentStates);
      },
      error: (err) => console.error('Error cargando estados de equipos:', err)
    });
  }
  loadFiltersData(): void {
    // Cargar sitios
    this.siteService.getSites().subscribe({
      next: (response: Site[] | ArrayResponse<Site>) => {
        if (Array.isArray(response)) {
          this.sites = response;
        } else {
          this.sites = response.data;
        }
        console.log('📍 Sitios cargados:', this.sites);
      },
      error: (err) => console.error('Error cargando sitios:', err)
    });

    // Cargar tipos de equipo
    this.equipmentService.getEquipmentTypes().subscribe({
      next: (response: TypeEquipement[] | ArrayResponse<TypeEquipement>) => {
        if (Array.isArray(response)) {
          this.equipmentTypes = response;
        } else {
          this.equipmentTypes = response.data;
        }
        console.log('🔧 Tipos cargados:', this.equipmentTypes);
      },
      error: (err) => console.error('Error cargando tipos:', err)
    });

    // Cargar técnicos
    this.userService.getTechnicians().subscribe({
      next: (response: User[] | ArrayResponse<User>) => {
        if (Array.isArray(response)) {
          this.technicians = response;
        } else {
          this.technicians = response.data;
        }
        console.log('👥 Técnicos cargados:', this.technicians);
      },
      error: (err) => console.error('Error cargando técnicos:', err)
    });
  }

  loadDashboardData(filters?: DashboardFilters): void {
    this.isLoading = true;
    // 👇 CONEXIÓN CON BACKEND REAL (cuando esté listo)
  /*this.dashboardService.getDashboardData(filters).subscribe({
    next: (data) => {
      this.dashboardData = data;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error cargando dashboard:', error);
      this.loadMockData(); // Datos de ejemplo mientras tanto
      this.isLoading = false;
    }
  });*/
    // Simular carga de datos
    setTimeout(() => {
      this.dashboardData = {
        kpis: {
          monthlyRepairs: 45,
          activeTechnicians: 8,
          avgRepairTime: 24.5,
          availabilityPercentage: 92.5,
          maintenanceAlerts: 3
        },
        monthlyRepairs: [
          { month: '01', year: 2026, completed: 12, pending: 5, inProgress: 3 },
          { month: '02', year: 2026, completed: 15, pending: 4, inProgress: 6 },
          { month: '03', year: 2026, completed: 18, pending: 7, inProgress: 4 }
        ],
        equipmentStatus: {
          operational: 45,
          inRepair: 8,
          retired: 3,
          maintenance: 4
        },
        topTechnicians: [
          { technicianId: '1', technicianName: 'Juan Pérez', completedRepairs: 28, avgRepairTime: 18.5 },
          { technicianId: '2', technicianName: 'María García', completedRepairs: 24, avgRepairTime: 22.3 },
          { technicianId: '3', technicianName: 'Carlos López', completedRepairs: 19, avgRepairTime: 25.1 }
        ],
        topFailures: [
          { equipmentId: '1', serialNumber: 'SN-001', model: 'Corolla', failureCount: 5, lastFailureDate: '2026-03-01' },
          { equipmentId: '2', serialNumber: 'SN-002', model: 'Yaris', failureCount: 3, lastFailureDate: '2026-02-28' },
          { equipmentId: '3', serialNumber: 'SN-003', model: 'Hilux', failureCount: 2, lastFailureDate: '2026-03-05' }
        ]
      };
      this.isLoading = false;
    }, 1000);
  }

  // ========== MÉTODOS PARA DIÁLOGOS ==========

  openSiteSelector(): void {
    const dialogRef = this.dialog.open(SiteSelectorDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { 
        sites: this.sites, 
        selectedId: this.filters.siteId 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id === '') {
          this.filters.siteId = '';
          this.selectedSiteName = 'Todos';
          this.selectedSiteId ='';
        } else {
          this.filters.siteId = result.id;
          this.selectedSiteName = `${result.code} - ${result.locality}`;
          this.selectedSiteId=result.id;
        }
      }
    });
  }

  openTypeSelector(): void {
    const dialogRef = this.dialog.open(TypeSelectorDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      data: { 
        types: this.equipmentTypes, 
        selectedId: this.filters.equipmentTypeId 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id === '') {
          this.filters.equipmentTypeId = '';
          this.selectedTypeName = 'Todos';
          this.selectedSiteId='';
        } else {
          this.filters.equipmentTypeId = result.id;
          this.selectedTypeName = result.name;
          this.selectedSiteId=result.id;
        }
      }
    });
  }


 openEquipmentStatusSelector(): void {
  const dialogRef = this.dialog.open(EquipmentStatusSelectorDialogComponent, {
    width: '500px',
    maxWidth: '95vw',
    data: { 
      statuses: this.equipmentStates, 
      selected: this.filters.equipmentStatusId 
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (result.id === '') {
        this.filters.equipmentStatusId = '';
        this.selectedStatusLabel = 'Todos';
        this.selectedEquipmentStatusId='';
      } else {
        this.filters.equipmentStatusId = result.id;
        this.selectedStatusLabel = result.name;
        this.selectedEquipmentStatusId=result.id;
      }
      console.log('✅ Filtro de estado actualizado:', this.filters);
    }
  });
}

  // ========== MÉTODOS DE FILTROS ==========

  applyFilters(): void {
    console.log('🔍 Aplicando filtros:', this.filters);
    this.selectedSiteId = this.filters.siteId || '';
   this.selectedTypeId = this.filters.equipmentTypeId || '';
   this.selectedEquipmentStatusId = this.filters.equipmentStatusId || '';
    this.filtersApplied = true;
    this.loadDashboardData(this.filters);
  }

  clearFilters(): void {
    this.filters = {
      siteId: '',
      equipmentTypeId: '',
      technicianId: '',
      equipmentStatusId: '',
      
    };
    this.selectedSiteName = '';
    this.selectedTypeName = '';
    this.selectedTechnicianName = '';
    this.selectedStatusLabel = '';
    this.selectedSiteId ='';
  this.selectedTypeId ='';
  this.selectedEquipmentStatusId = '';
   this.filtersApplied = false;
    this.loadDashboardData();
  }

  onFilterChange(filters: DashboardFilters): void {
    this.filters = filters;
    this.loadDashboardData(filters);
  }
}