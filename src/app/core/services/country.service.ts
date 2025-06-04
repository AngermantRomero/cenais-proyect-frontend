import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../interfaces/maker.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse,SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.country}`;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<ArrayResponse<Country>> {
    return this.http.get<ArrayResponse<Country>>(this.baseUrl);
  }

  getCountryById(id: string): Observable<SingleResponse<Country>> {
    return this.http.get<SingleResponse<Country>>(`${this.baseUrl}/${id}`);
  }
  createCountry(countryData: Omit<Country, 'id'>): Observable<SingleResponse<Country>> {
    return this.http.post<SingleResponse<Country>>(this.baseUrl, countryData);
  }
    updateCountry(id: string, countryData: Partial<Country>): Observable<SingleResponse<Country>> {
    return this.http.patch<SingleResponse<Country>>(`${this.baseUrl}/${id}`, countryData);
  }
  deleteCountry(id: string): Observable<SingleResponse<void>> {
    return this.http.delete<SingleResponse<void>>(`${this.baseUrl}/${id}`);
  }
}