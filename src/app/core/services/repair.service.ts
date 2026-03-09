import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { Repair, CreateRepairDto, UpdateRepairDto, RepairFilter } from '../interfaces/repair.interface';
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  private readonly baseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;

  constructor(private http: HttpClient) {}

 getRepairs(filter?: RepairFilter): Observable<Repair[]> {
  let params = new HttpParams();

  if (filter) {
    if (filter.equipmentId) params = params.set('equipmentId', filter.equipmentId);
    if (filter.technicianId) params = params.set('technicianId', filter.technicianId);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.startDate) params = params.set('startDateFrom', filter.startDate);
    if (filter.endDate) params = params.set('startDateTo', filter.endDate);
    if (filter.search) params = params.set('search', filter.search);
  }

  return this.http
    .get<ArrayResponse<Repair>>(`${this.baseUrl}${this.endpoints.repairs}`, { params })
    .pipe(map(response => response.data));
}

  getRepair(id: string): Observable<Repair> {
    const params = new HttpParams()
      .set('expand', 'equipment,equipment.model,equipment.maker,technician');

    return this.http
      .get<SingleResponse<Repair>>(`${this.baseUrl}${this.endpoints.repairs}/${id}`, { params })
      .pipe(map(response => response.data));
  }

  getRepairsByEquipment(equipmentId: string): Observable<Repair[]> {
    return this.getRepairs({ equipmentId });
  }

  createRepair(data: CreateRepairDto): Observable<Repair> {
    return this.http
      .post<SingleResponse<Repair>>(`${this.baseUrl}${this.endpoints.repairs}`, data)
      .pipe(map(response => response.data));
  }

  updateRepair(id: string, data: UpdateRepairDto): Observable<Repair> {
    return this.http
      .patch<SingleResponse<Repair>>(`${this.baseUrl}${this.endpoints.repairs}/${id}`, data)
      .pipe(map(response => response.data));
  }

  deleteRepair(id: string): Observable<void> {
    return this.http
      .delete<SingleResponse<void>>(`${this.baseUrl}${this.endpoints.repairs}/${id}`)
      .pipe(map(() => undefined));
  }

  completeRepair(id: string, observations?: string): Observable<Repair> {
    return this.http
      .patch<SingleResponse<Repair>>(
        `${this.baseUrl}${this.endpoints.repairs}/${id}/completar`,
        { observations }
      )
      .pipe(map(response => response.data));
  }

  changeStatus(id: string, status: string): Observable<Repair> {
    return this.http
      .patch<SingleResponse<Repair>>(
        `${this.baseUrl}${this.endpoints.repairs}/${id}/status`,
        { status }
      )
      .pipe(map(response => response.data));
  }
}