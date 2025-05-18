import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface'; 
import { ArrayResponse } from '../interfaces/http.responses.interface';

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