import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User, Role } from '../interfaces/user.interface'; 
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ArrayResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}`;
    return this.http.get<ArrayResponse<User>>(url);
  }

  createUser(userData: Omit<User, 'id'>): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.auth}/register`;
    return this.http.post<SingleResponse<User>>(url, userData);
  }

  getRoles(): Observable<ArrayResponse<Role>> {
    const url = `${this.apiBaseUrl}${this.endpoints.roles}`; // Eliminado espacio al final
    return this.http.get<ArrayResponse<Role>>(url);
  }

  updateUser(id: string, userData: Partial<User>): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`;
    return this.http.patch<SingleResponse<User>>(url, userData);
  }

  updateUserStatus(id: string, isActive: boolean): Observable<User> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`;
    return this.http.patch<SingleResponse<User>>(url, { isActive }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error updating status:', error);
        return throwError(() => new Error(error.message || 'Error al actualizar el estado'));
      })
    );
  }

  deleteUser(id: string): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`; // Corregida la construcción de URL
    return this.http.delete<SingleResponse<User>>(url).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error(error.message || 'Error al eliminar el usuario'));
      })
    );
  }
}