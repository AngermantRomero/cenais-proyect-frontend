import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import { User,Role } from '../interfaces/user.interface'; 
import { ArrayResponse } from '../interfaces/http.responses.interface';
import { SingleResponse } from '../interfaces/http.responses.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
    private authEndpoint = environment.endpoints.auth;
    private usersEndpoint = environment.endpoints.users;
    private rolesApiUrl = 'http://localhost:3000/api/roles';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ArrayResponse<User>> {
    return this.http.get<ArrayResponse<User>>(this.apiUrl);
  }
  createUser(userData: Omit<User, 'id'>): Observable<SingleResponse<User>> {
    const url = `${environment.apiUrl}${environment.endpoints.auth}/register`;
    return this.http.post<SingleResponse<User>>(
      url, 
      userData
    );
}
  getRoles(): Observable<ArrayResponse<Role>> {
    return this.http.get<ArrayResponse<Role>>(this.rolesApiUrl);
  }
  updateUser(id: string, userData: Partial<User>): Observable<SingleResponse<User>> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.patch<SingleResponse<User>>(url, userData);
}
 updateUserStatus(id: string, isActive: boolean): Observable<User> {
    return this.http.patch<SingleResponse<User>>(`${this.usersEndpoint}/${id}`, { isActive }).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error updating status:', error);
        return throwError(() => new Error(error.message || 'Error al actualizar el estado'));
      })
    );
  }
  deleteUser(id: number | string): Observable<SingleResponse<User>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<SingleResponse<User>>(url);
  }
}