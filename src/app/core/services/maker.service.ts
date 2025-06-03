import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Maker } from '../interfaces/maker.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse,SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class MakerService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.maker}`;

  constructor(private http: HttpClient) {}

  getMakers(): Observable<ArrayResponse<Maker>> {
    return this.http.get<ArrayResponse<Maker>>(this.baseUrl);
  }

  createMaker(MakerData: Omit<Maker, 'idMaker'>): Observable<SingleResponse<Maker>> {
    const dataToSend = {
      ...MakerData,
      country: typeof MakerData.country === 'string' 
        ? MakerData.country
        : MakerData?.country.id
    };
    return this.http.post<SingleResponse<Maker>>(this.baseUrl, dataToSend);
  }
updateMaker(id: string, MakerData: Partial<Maker>): Observable<SingleResponse<Maker>> {
  const dataToSend = {
    ...MakerData,
    country: MakerData.country && typeof MakerData.country !== 'string'
      ? MakerData.country.id
      : MakerData.country
  };

  return this.http.patch<SingleResponse<Maker>>(`${this.baseUrl}/${id}`, dataToSend);
}

  deleteMaker(id: string): Observable<SingleResponse<void>> {
    return this.http.delete<SingleResponse<void>>(`${this.baseUrl}/${id}`);
  }
}