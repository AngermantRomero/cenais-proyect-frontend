import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Maker, 
  CreateMakerDto,
  UpdateMakerDto 
} from '../interfaces/maker.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class MakerService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.maker}`;

  constructor(private http: HttpClient) {}

  getMakers(): Observable<ArrayResponse<Maker>> {
    return this.http.get<ArrayResponse<Maker>>(this.baseUrl);
  }

  createMaker(makerData: CreateMakerDto): Observable<SingleResponse<Maker>> {
  // No necesita transformación ya que country debe ser solo ID
  return this.http.post<SingleResponse<Maker>>(this.baseUrl, makerData);
}

 updateMaker(id: string, makerData: UpdateMakerDto): Observable<SingleResponse<Maker>> {
  return this.http.patch<SingleResponse<Maker>>(`${this.baseUrl}/${id}`, makerData);
}

  deleteMaker(id: string): Observable<SingleResponse<void>> {
    return this.http.delete<SingleResponse<void>>(`${this.baseUrl}/${id}`);
  }
}