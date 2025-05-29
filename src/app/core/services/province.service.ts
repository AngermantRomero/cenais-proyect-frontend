import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../interfaces/sites.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.provinces}`;

  constructor(private http: HttpClient) {}

  getProvinces(): Observable<ArrayResponse<Province>> {
    return this.http.get<ArrayResponse<Province>>(this.baseUrl);
  }
}