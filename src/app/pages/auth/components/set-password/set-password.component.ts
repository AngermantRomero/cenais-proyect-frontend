import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent {
  // Formulario reactivo
  passwordForm: FormGroup;
  
  // Estados del componente
  isLoading = false;
  hideNewPassword = true;
  hideConfirmPassword = true;
  token: string;

  // Servicios
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {
    // Inicialización del formulario
    this.passwordForm = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Obtener token de la URL o del almacenamiento
    this.token = this.route.snapshot.queryParams['token']; 
                
  }

  // Validador personalizado para coincidencia de contraseñas
  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  // Manejo del envío del formulario
 onSubmit() {
    if (this.passwordForm.invalid || this.isLoading) return;

    const { password} = this.passwordForm.value;
    this.isLoading = true;
    this.authService.setPassword(this.token, password).subscribe({
      next: () => {
        this.showSnackbar('Contraseña actualizada con éxito', 'success');
        this.passwordForm.reset();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.showSnackbar(err.error?.message || 'Error al actualizar la contraseña', 'error');
      },
      complete: () => this.isLoading = false
    });
  }

  // Mostrar notificación
  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Cerrar', {
      duration: type === 'success' ? 3000 : 5000,
      panelClass: [`${type}-snackbar`]
    });
  }
}