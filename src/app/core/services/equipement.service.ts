import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,map } from 'rxjs';
import { Equipment } from '../interfaces/equipement.interface';
import { Maker } from '../interfaces/equipement.interface';
import { TypeEquipement } from '../interfaces/equipement.interface';
import { EquipmentModel } from '../interfaces/equipement.interface';
import { EquipmentState } from '../interfaces/equipement.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
 private readonly BaseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;
  
  constructor(private http: HttpClient) { }

getEquipments(): Observable<ArrayResponse<Equipment>> {  
  return this.http.get<ArrayResponse<Equipment>>( `${this.BaseUrl}${this.endpoints.equipments}`);  
}

  getEquipment(id: string): Observable<SingleResponse<Equipment>> {
    return this.http.get<SingleResponse<Equipment>>(`${this.BaseUrl}${this.endpoints.equipments}/${id}`);
  }
  getMakers(): Observable<Maker[]> {
    return this.http.get<ArrayResponse<Maker>>(
      `${this.BaseUrl}${environment.endpoints.makers}`
    ).pipe(
      map(response => response.data)
    );
  }
getModels(): Observable<EquipmentModel[]> {
    return this.http.get<ArrayResponse<EquipmentModel>>(
      `${this.BaseUrl}${environment.endpoints.models}`
    ).pipe(
      map(response => response.data)
    );
  }

getEquipmentTypes(): Observable<TypeEquipement[]> {
    return this.http.get<ArrayResponse<TypeEquipement>>(
      `${this.BaseUrl}${environment.endpoints.types}`
    ).pipe(
      map(response => response.data)
    );
  }

getEquipmentStates(): Observable<EquipmentState[]> {
    return this.http.get<ArrayResponse<EquipmentState>>(
      `${this.BaseUrl}${environment.endpoints.states}`
    ).pipe(
      map(response => response.data)
    );
  }


   createEquipment(EquipmentData: Omit<Equipment, 'id'>): Observable<Equipment> {
    return this.http.post<SingleResponse<Equipment>>(
      `${this.BaseUrl}${environment.endpoints.equipments}`,
      EquipmentData
    ).pipe(
      map(response => response.data)
    );
  }
  updateEquipment(id: string,EquipmentData:Partial<Equipment>  ): Observable<Equipment> {
    return this.http.put<SingleResponse<Equipment>>(
      `${this.BaseUrl}${environment.endpoints.equipments}/${id}`,
      EquipmentData
    ).pipe(
      map(response => response.data)
    );
  }

 deleteEquipment(id: string): Observable<void> {
    return this.http.delete<SingleResponse<void>>(
      `${this.BaseUrl}${environment.endpoints.equipments}/${id}`
    ).pipe(
      map(() => {}) 
    );
  }
}