import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading = false;  

  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


onSubmit() {
  if (this.loginForm.invalid) {
    this.markAllAsTouched();
    console.warn('Formulario inválido', this.loginForm.errors);
    return;
  }

  const { email, password } = this.loginForm.value as { email: string; password: string };;
  console.log('Datos para login:', { email, password });
  this.isLoading = true; 
  this.authService.login(email, password).subscribe({
    next: (response) => {
      console.log('Login exitoso:', response);
      this.snackBar.open('Login exitoso', 'Cerrar', {
        duration: 3000
      });
      this.loginForm.reset();
      this.isLoading = false;      
    },
    error: (error) => {
      console.error('Error al iniciar sesión:', error);
      this.snackBar.open('Error al iniciar sesión', 'Cerrar', {
        duration: 3000
      });
      this.isLoading = false;
    }
  });
  
  
}

togglePasswordVisibility(passwordInput: HTMLInputElement) {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
private markAllAsTouched() {
  Object.values(this.loginForm.controls).forEach(control => {
    control.markAsTouched();
  });
}
}