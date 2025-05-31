// services/equipment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipment } from '../interfaces/equipement.interface';
import { Maker } from '../interfaces/equipement.interface';
import { TypeEquipment } from '../interfaces/equipement.interface';
import { EquipmentModel } from '../interfaces/equipement.interface';
import { EquipmentState } from '../interfaces/equipement.interface';
@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  private apiUrl = 'https://tu-api/equipments';

  constructor(private http: HttpClient) { }

  getEquipments(): Observable<Equipment[]> {
    return this.http.get<Equipment[]>(this.apiUrl);
  }

  getEquipment(id: string): Observable<Equipment> {
    return this.http.get<Equipment>(`${this.apiUrl}/${id}`);
  }
  getMakers(): Observable<Maker[]> {
  return this.http.get<Maker[]>(`${this.apiUrl}/makers`);
}

getModels(): Observable<EquipmentModel[]> {
  return this.http.get<EquipmentModel[]>(`${this.apiUrl}/models`);
}

getEquipmentTypes(): Observable<TypeEquipment[]> {
  return this.http.get<TypeEquipment[]>(`${this.apiUrl}/types`);
}

getEquipmentStates(): Observable<EquipmentState[]> {
  return this.http.get<EquipmentState[]>(`${this.apiUrl}/states`);
}

  createEquipment(equipment: Equipment): Observable<Equipment> {
    return this.http.post<Equipment>(this.apiUrl, equipment);
  }

  updateEquipment(id: string, equipment: Equipment): Observable<Equipment> {
    return this.http.put<Equipment>(`${this.apiUrl}/${id}`, equipment);
  }

  deleteEquipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}