export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  siteId?: string;
  equipmentTypeId?: string;
  technicianId?: string;
  equipmentStatusId?: string;
}

export interface KpiData {
  monthlyRepairs: number;
  activeTechnicians: number;
  avgRepairTime: number; // en horas
  availabilityPercentage: number;
  maintenanceAlerts: number;
}

export interface TechnicianPerformance {
  technicianId: string;
  technicianName: string;
  completedRepairs: number;
  avgRepairTime: number;
}

export interface EquipmentFailure {
  equipmentId: string;
  serialNumber: string;
  model: string;
  failureCount: number;
  lastFailureDate: string;
}

export interface MonthlyRepairs {
  month: string;
  year: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export interface EquipmentStatus {
  operational: number;
  inRepair: number;
  retired: number;
  maintenance: number;
}

export interface DashboardData {
  kpis: KpiData;
  monthlyRepairs: MonthlyRepairs[];
  equipmentStatus: EquipmentStatus;
  topTechnicians: TechnicianPerformance[];
  topFailures: EquipmentFailure[];
    repairsByStatus?: { [key: string]: number }; // Ej: { pending: 5, in_progress: 8, completed: 15 }
  equipmentByStatus?: { [key: string]: number }; // Ej: { operational: 45, in_repair: 8, maintenance: 4, retired: 3 }
  repairsByTechnician?: TechnicianRepair[];
  equipmentBySite?: SiteEquipment[];
}
export interface TechnicianRepair {
  technicianId: string;
  technicianName: string;
  repairCount: number;
  month?: string;
}

export interface SiteEquipment {
  siteId: string;
  siteName: string;
  equipmentCount: number;
}