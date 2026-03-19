import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Equipment } from '../interfaces/equipement.interface';
import { Maker } from '../interfaces/equipement.interface';
import { TypeEquipement } from '../interfaces/equipement.interface';
import { EquipmentModel } from '../interfaces/equipement.interface';
import { EquipmentState } from '../interfaces/equipement.interface';
import { environment } from '../../../enviroments/enviroment';
import { Site } from '../interfaces/sites.interface';
import {
  ArrayResponse,
  SingleResponse,
} from '../interfaces/http.responses.interface';

type CreateEquipmentPayload = {
  serialNumber: string;
  inventoryNumber: string;
  startOfOperation: string;
  makerId: string;
  modelId: string;
  typeEquipementId: string;
  initialStateId: string;
  siteId?: string;
  changedBy?: string;
};

type UpdateEquipmentPayload = Partial<CreateEquipmentPayload> & {
  currentStateId?: string;
  removeSite?: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly baseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;

  constructor(private http: HttpClient) {}

  getEquipments(): Observable<Equipment[]> {
    const params = new HttpParams().set(
      'expand',
      'maker,model,typeEquipement,currentState,site,site.province'
    );

    return this.http
      .get<ArrayResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}`, { params })
      .pipe(map((response) => response.data));
  }

  getEquipment(id: string): Observable<Equipment> {
    const params = new HttpParams().set(
      'expand',
      'maker,model,typeEquipement,currentState,site,site.province,stateHistory,stateHistory.state'
    );

    return this.http
      .get<SingleResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}/${id}`, { params })
      .pipe(map((response) => response.data));
  }

  createEquipment(data: CreateEquipmentPayload): Observable<Equipment> {
    return this.http
      .post<SingleResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}`, data)
      .pipe(map((response) => response.data));
  }

  updateEquipment(id: string, data: UpdateEquipmentPayload): Observable<Equipment> {
    return this.http
      .patch<SingleResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}/${id}`, data)
      .pipe(map((response) => response.data));
  }

  deleteEquipment(id: string): Observable<void> {
    return this.http
      .delete<SingleResponse<void>>(`${this.baseUrl}${this.endpoints.equipments}/${id}`)
      .pipe(map(() => undefined));
  }

  // ==================== CATÁLOGOS ====================

  getMakers(): Observable<Maker[]> {
    return this.http
      .get<ArrayResponse<Maker>>(`${this.baseUrl}${this.endpoints.makers}`)
      .pipe(map((response) => response.data));
  }

  getModels(makerId?: string): Observable<EquipmentModel[]> {
    let params = new HttpParams();
    if (makerId) {
      params = params.set('makerId', makerId);
    }
    return this.http
      .get<ArrayResponse<EquipmentModel>>(`${this.baseUrl}${this.endpoints.models}`, { params })
      .pipe(map((response) => response.data));
  }

  getEquipmentTypes(): Observable<TypeEquipement[]> {
    return this.http
      .get<ArrayResponse<TypeEquipement>>(`${this.baseUrl}${this.endpoints.types}`)
      .pipe(map((response) => response.data));
  }

  getEquipmentStates(): Observable<EquipmentState[]> {
    return this.http
      .get<ArrayResponse<EquipmentState>>(`${this.baseUrl}${this.endpoints.states}`)
      .pipe(map((response) => response.data));
  }

  getAvailableSites(): Observable<Site[]> {
    return this.http
      .get<ArrayResponse<Site>>(`${this.baseUrl}${this.endpoints.sites}`)
      .pipe(map((response) => response.data));
  }

  // ==================== GESTIÓN DE UBICACIÓN ====================

  assignToSite(equipmentId: string, siteId: string): Observable<Equipment> {
    return this.http
      .post<SingleResponse<Equipment>>(
        `${this.baseUrl}${this.endpoints.equipments}/${equipmentId}/assign-site`,
        { siteId }
      )
      .pipe(map((response) => response.data));
  }

  removeFromSite(equipmentId: string): Observable<Equipment> {
    return this.http
      .delete<SingleResponse<Equipment>>(
        `${this.baseUrl}${this.endpoints.equipments}/${equipmentId}/site`
      )
      .pipe(map((response) => response.data));
  }

  // ==================== FILTROS ====================

  getEquipmentsBySite(siteId: string): Observable<Equipment[]> {
    const params = new HttpParams().set('expand', 'maker,model,typeEquipement,currentState');
    return this.http
      .get<ArrayResponse<Equipment>>(
        `${this.baseUrl}${this.endpoints.equipments}/site/${siteId}`,
        { params }
      )
      .pipe(map((response) => response.data));
  }

  getEquipmentsByState(stateId: string): Observable<Equipment[]> {
    return this.http
      .get<ArrayResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}/state/${stateId}`)
      .pipe(map((response) => response.data));
  }

  getEquipmentBySerial(serialNumber: string): Observable<Equipment> {
    return this.http
      .get<SingleResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}/serial/${serialNumber}`)
      .pipe(map((response) => response.data));
  }

  getEquipmentsByDate(date: string): Observable<Equipment[]> {
    return this.http
      .get<ArrayResponse<Equipment>>(`${this.baseUrl}${this.endpoints.equipments}/by-date/${date}`)
      .pipe(map((response) => response.data));
  }

  // ==================== HISTORIAL DE ESTADOS ====================

  getEquipmentStateHistory(equipmentId: string): Observable<any[]> {
    return this.http
      .get<ArrayResponse<any>>(`${this.baseUrl}${this.endpoints.equipments}/${equipmentId}/state-history`)
      .pipe(map((response) => response.data));
  }

  // - Cambiar estado manualmente
  changeEquipmentState(equipmentId: string, newStateId: string, changedBy: string = 'system'): Observable<Equipment> {
    return this.http
      .patch<SingleResponse<Equipment>>(
        `${this.baseUrl}${this.endpoints.equipments}/${equipmentId}/state`,
        { stateId: newStateId, changedBy }
      )
      .pipe(map((response) => response.data));
  }
}