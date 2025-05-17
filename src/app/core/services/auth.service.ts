import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`; 
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenKey = 'auth_token';
 private passwordResetTokenKey = 'reset_token';
  
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {

    this.checkInitialAuth();
  }

   // Método para confirmar/establecer nueva contraseña
   setPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.authUrl}/activate`, { token, password })
  }

  // Método para guardar el token de recuperación temporalmente
  setPasswordResetToken(token: string): void {
    localStorage.setItem(this.passwordResetTokenKey, token);
  }

  getPasswordResetToken(): string | null {
    return localStorage.getItem(this.passwordResetTokenKey);
  }
  
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.authUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.isAuthenticatedSubject.next(true);
        //this.router.navigate(['/dashboard']); 
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private checkInitialAuth(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }
}