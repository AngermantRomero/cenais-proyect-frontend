import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User,Role } from '../interfaces/user.interface'; 
import { ArrayResponse } from '../interfaces/http.responses.interface';
import { SingleResponse } from '../interfaces/http.responses.interface';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private rolesApiUrl = 'http://localhost:3000/api/roles';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<ArrayResponse<User>> {
    return this.http.get<ArrayResponse<User>>(this.apiUrl);
  }
  createUser(userData: Omit<User, 'id'>): Observable<SingleResponse<User>> {
    return this.http.post<SingleResponse<User>>(this.apiUrl, userData);
  }
  getRoles(): Observable<ArrayResponse<Role>> {
    return this.http.get<ArrayResponse<Role>>(this.rolesApiUrl);
  }
  updateUser(id: string, userData: Partial<User>): Observable<SingleResponse<User>> {
  const url = `${this.apiUrl}/${id}`;
  return this.http.patch<SingleResponse<User>>(url, userData);
}
  deleteUser(id: number | string): Observable<SingleResponse<User>> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<SingleResponse<User>>(url);
  }
}