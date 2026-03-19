import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { 
  DashboardData, 
  DashboardFilters,
  TechnicianPerformance,
  EquipmentFailure 
} from '../interfaces/dashboard.interface';
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly baseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los datos del dashboard
   */
  getDashboardData(filters?: DashboardFilters): Observable<DashboardData> {
    let params = new HttpParams();

    if (filters) {
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.siteId) params = params.set('siteId', filters.siteId);
      if (filters.equipmentTypeId) params = params.set('equipmentTypeId', filters.equipmentTypeId);
      if (filters.technicianId) params = params.set('technicianId', filters.technicianId);
      if (filters.equipmentStatusId) params = params.set('status', filters.equipmentStatusId);
    }

    return this.http
      .get<SingleResponse<DashboardData>>(`${this.baseUrl}/dashboard`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener técnicos con más reparaciones
   */
  getTopTechnicians(limit: number = 5): Observable<TechnicianPerformance[]> {
    const params = new HttpParams().set('limit', limit.toString());
    
    return this.http
      .get<ArrayResponse<TechnicianPerformance>>(`${this.baseUrl}/dashboard/top-technicians`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener equipos con más fallas
   */
  getTopFailures(limit: number = 5): Observable<EquipmentFailure[]> {
    const params = new HttpParams().set('limit', limit.toString());
    
    return this.http
      .get<ArrayResponse<EquipmentFailure>>(`${this.baseUrl}/dashboard/top-failures`, { params })
      .pipe(map(response => response.data));
  }
  /**
   * Obtener datos de reparaciones por mes
   */
  getMonthlyRepairs(year?: number): Observable<any[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year.toString());

    return this.http
      .get<ArrayResponse<any>>(`${this.baseUrl}/dashboard/monthly-repairs`, { params })
      .pipe(map(response => response.data));
  }

  /**
   * Obtener estado de equipos
   */
  getEquipmentStatus(): Observable<any> {
    return this.http
      .get<SingleResponse<any>>(`${this.baseUrl}/dashboard/equipment-status`)
      .pipe(map(response => response.data));
  }
}