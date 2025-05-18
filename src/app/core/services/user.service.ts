import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArrayResponse } from '../interfaces/array-response.interface'; 
import { User } from '../interfaces/user.interface'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<ArrayResponse<User>> {
    return this.http.get<ArrayResponse<User>>(this.apiUrl);
  }
}