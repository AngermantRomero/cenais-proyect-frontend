import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Province } from '../interfaces/sites.interface';
import { environment } from '../../../enviroments/enviroment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProvincesService {
  private readonly baseUrl = `${environment.apiUrl}/provinces`; // Usando environment

  constructor(private http: HttpClient) {}



  getProvinces(): Observable<Province[]> {
    return this.http.get<{ data: Province[] }>(this.baseUrl).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching provinces:', error);
        return of([]);
      })
    );
  }
getProvinceNameById(id: string): Observable<string> {
  if (!id) {
    return of('No asignada');
  }
  return this.http.get<Province>(`${this.baseUrl}/${id}`).pipe(
map(province => province?.name || 'No asignada'),
    catchError(error => {
      console.error(`Error fetching province ${id}:`, error);
      return of('No asignada');
    })
  );
}


getProvincesByIds(ids: string[]): Observable<Province[]> {
  if (!ids || ids.length === 0) {
    return of([]);
  }
  return this.http.get<Province[]>(`${this.baseUrl}/by-ids`, {
    params: { ids: ids.join(',') }
  }).pipe(
    catchError(() => of([]))
  );
}
getOneProvinceById(id: string): Observable<Province | null> {
  return this.http.get<Province>(`${this.baseUrl}/${id}`).pipe(
    catchError(() => of(null))  // Devuelve null en caso de error
  );
}
}