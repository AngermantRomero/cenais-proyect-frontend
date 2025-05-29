import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Site } from '../interfaces/sites.interface';
import { environment } from '../../../enviroments/enviroment';
import { ArrayResponse,SingleResponse } from '../interfaces/http.responses.interface';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.sites}`;

  constructor(private http: HttpClient) {}

  getSites(): Observable<ArrayResponse<Site>> {
    return this.http.get<ArrayResponse<Site>>(this.baseUrl);
  }

  createSite(siteData: Omit<Site, 'id'>): Observable<SingleResponse<Site>> {
    return this.http.post<SingleResponse<Site>>(this.baseUrl, siteData);
  }

  updateSite(id: string, siteData: Partial<Site>): Observable<SingleResponse<Site>> {
    return this.http.patch<SingleResponse<Site>>(`${this.baseUrl}/${id}`, siteData);
  }

  deleteSite(id: string): Observable<SingleResponse<void>> {
    return this.http.delete<SingleResponse<void>>(`${this.baseUrl}/${id}`);
  }
}