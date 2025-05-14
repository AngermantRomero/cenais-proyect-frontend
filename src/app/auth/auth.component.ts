import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet} from '@angular/router'; 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatIconModule,RouterOutlet] ,
    template: `
    <div class="auth-container">
     
      <header class="auth-header">
        <img src="assets/logo.svg" alt="Logo" class="logo">
      </header>

      <router-outlet></router-outlet> 

      
      <div *ngIf="errorMessage" class="error-message">
        <mat-icon>error</mat-icon>
        {{ errorMessage }}
        <button mat-icon-button (click)="clearError()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <footer class="auth-footer">
        © {{ currentYear }} Mi Aplicación
      </footer>
    </div>
  `,
})
export class AuthComponent {
  errorMessage: string | null = null;
 constructor(private router: Router) {}
 navigateToLogin(){
    this.router.navigate(['/auth/login']); 
  }

  clearError(): void {
    this.errorMessage = null;
  }

  currentYear: number = new Date().getFullYear();
}
