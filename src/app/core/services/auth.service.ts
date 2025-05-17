import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { SingleResponse } from '../interfaces/http.responses.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`; 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.checkInitialAuth();
  }

  login(email: string, password: string): Observable<SingleResponse<User>> {
    return this.http.post<SingleResponse<User>>(`${this.authUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        if (response.data) {
        this.setUserData(response.data);
        this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setUserData(data: User): void {
    const {accessToken, ...user} = data;
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_token', accessToken || '');
  }

  private getUserData(): User | null {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
  }
  

  private checkInitialAuth(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }
}