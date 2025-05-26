import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Site, CreateSiteDto, UpdateSiteDto, Province } from '../interfaces/sites.interface';
import { environment } from '../../../enviroments/enviroment';
import { ProvincesService } from './province.service';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class SitesService {
  private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.sites}`;

  constructor(
    private http: HttpClient,
    private provincesService: ProvincesService
  ) {}

  private extractData<T>(res: ApiResponse<T>): T {
    if (!res.success) {
      throw new Error(res.message || 'API request failed');
    }
    return res.data;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

 private generateId(): string {
    return crypto.randomUUID?.() || 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
  }

  getSites(): Observable<Site[]> {
    return this.http.get<ApiResponse<Site[]>>(this.baseUrl).pipe(
      map(this.extractData),
      catchError(this.handleError<Site[]>('getSites', []))
    );
  }

 getSitesWithProvinceNames(): Observable<Site[]> {
    return this.http.get<ApiResponse<CreateSiteDto[]>>(this.baseUrl).pipe(
      switchMap(response => {
        const sitesData = this.extractData(response);
        if (!sitesData || sitesData.length === 0) {
          return of([] as Site[]);
        }

        const provinceIds = [...new Set(sitesData.map(s => s.province))];

        return forkJoin({
          sites: of(sitesData),
          provinces: provinceIds.length > 0
            ? this.provincesService.getProvincesByIds(provinceIds)
            : of([] as Province[])
        }).pipe(
          map(({ sites, provinces }) => 
            sites.map(site => ({
              id: site.id || this.generateId(),
              locality: site.locality,
              code: site.code,
              province: {
                id: site.province,
                name: provinces.find(p => p.id === site.province)?.name || 'No asignada'
              }
            }))
          )
        );
      }),
      catchError(error => {
        console.error('Error loading sites:', error);
        return of([] as Site[]);
      })
    );
  }
 

  createSite(site: CreateSiteDto): Observable<Site> {
    return this.http.post<ApiResponse<Site>>(this.baseUrl, site).pipe(
      map(this.extractData),
      catchError(this.handleError<Site>('createSite'))
    );
  }

  updateSite(id: string, site: UpdateSiteDto): Observable<Site> {
    return this.http.patch<ApiResponse<Site>>(`${this.baseUrl}/${id}`, site).pipe(
      map(this.extractData),
      catchError(this.handleError<Site>('updateSite'))
    );
  }

  deleteSite(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => undefined),
      catchError(this.handleError<void>('deleteSite'))
    );
  }

  getSiteById(id: string): Observable<Site> {
    return this.http.get<ApiResponse<Site>>(`${this.baseUrl}/${id}`).pipe(
      map(this.extractData),
      catchError(this.handleError<Site>('getSiteById'))
    );
  }
}