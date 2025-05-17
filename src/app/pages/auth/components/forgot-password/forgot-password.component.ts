import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  // Formulario reactivo
  forgotForm: FormGroup;
  
  // Estados del componente
  isLoading = false;

  // Servicios
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid || this.isLoading) return;

    const { email } = this.forgotForm.value;
    this.isLoading = true;

    /*this.authService.sendPasswordResetEmail(email).subscribe({
      next: () => {
        this.showSnackbar('Enlace de recuperación enviado a tu email', 'success');
        this.forgotForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showSnackbar(err.error?.message || 'Error al enviar el enlace', 'error');
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });*/
  }

  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: type === 'success' ? 3000 : 5000,
      panelClass: [`${type}-snackbar`]
    });
  }
}