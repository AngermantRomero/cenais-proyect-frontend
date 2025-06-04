import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
import { Model,CreateModelDto,UpdateModelDto,ModelFiltersDto } from '../interfaces/model.interface';
import { SingleResponse,ArrayResponse } from '../interfaces/http.responses.interface';
 


@Injectable({
  providedIn: 'root'
})
export class ModelService {
   private readonly baseUrl = `${environment.apiUrl}${environment.endpoints.model}`;

  constructor(private http: HttpClient) { }

  createModel(modelData: CreateModelDto): Observable<SingleResponse<Model>> {
    return this.http.post<SingleResponse<Model>>(this.baseUrl, modelData).pipe(
      catchError(this.handleError)
    );
  }

  getModels(filters?: ModelFiltersDto): Observable<ArrayResponse<Model>> {
    let params = new HttpParams();

    if (filters?.modelName) {
      params = params.append('modelName', filters.modelName);
    }

    if (filters?.description) {
      params = params.append('description', filters.description);
    }

    if (filters?.makerId) {
      params = params.append('makerId', filters.makerId);
    }

    return this.http.get<ArrayResponse<Model>>(this.baseUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getModelById(id: string): Observable<SingleResponse<Model>> {
    if (!id) {
      return throwError(() => new Error('ID de modelo no proporcionado'));
    }
    return this.http.get<SingleResponse<Model>>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateModel(id: string, updateData: UpdateModelDto): Observable<SingleResponse<Model>> {
    if (!id) {
      return throwError(() => new Error('ID de modelo no proporcionado'));
    }
    return this.http.patch<SingleResponse<Model>>(`${this.baseUrl}/${id}`, updateData).pipe(
      catchError(this.handleError)
    );
  }

  deleteModel(id: string): Observable<SingleResponse<void>> {
    if (!id) {
      return throwError(() => new Error('ID de modelo no proporcionado'));
    }
    return this.http.delete<SingleResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al realizar la operación';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Datos inválidos';
      } else if (error.status === 404) {
        errorMessage = 'Modelo no encontrado';
      } else if (error.status === 409) {
        errorMessage = 'Conflicto: El modelo ya existe';
      } else {
        errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}