import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User, Role } from '../../../../../../core/interfaces/user.interface';
import { UserService } from '../../../../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-user-from',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatSlideToggleModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean = false;
  roles: Role[] = [];
  isSubmitting: boolean = false;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    

    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      phone: [
        '',
        [
          Validators.pattern(/^[56]\+?\d{7}$/),
          Validators.maxLength(8),
        ],
      ],
      role: ['', Validators.required],
      isActive:[false,Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();

    if (this.data?.user) {
      this.isEditMode = true;
      this.userForm.patchValue({
        ...this.data.user,
        role: this.data.user.role?.id, // Extrae solo el ID
      });
    }
  }

  loadRoles() {
    this.userService.getRoles().subscribe({
      next: (response) => {
        this.roles = response.data;
        console.log('Roles cargados:', this.roles);
        if (this.data?.user && this.roles.length > 0) {
          this.patchUserData();
        }
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      },
    });
  }
  private patchUserData(): void {
    this.isEditMode = true;
    const phoneValue = this.data.user.phone?.startsWith('+53') 
    ? this.data.user.phone.slice(3)
     :this.data.user.phone || '';
    this.userForm.patchValue({
      ...this.data.user,
      role: this.data.user.role?.id,
      phone: phoneValue || ''
    });
  }
  private markFormAsTouched(): void {
    Object.values(this.userForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  private prepareUserData(formData: any): any {
    // Transforma los datos del formulario si es necesario
    return {
      ...formData,
      // Ejemplo: convertir a mayúsculas
      name: formData.name.trim().toUpperCase(),
      lastName: formData.lastName.trim().toUpperCase(),
    };
  }

  private getErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }

    if (error.status === 409) {
      return 'El email ya está registrado';
    }

    return `Error al ${
      this.isEditMode ? 'actualizar' : 'crear'
    } el usuario. Intente nuevamente`;
  }

  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.userForm.invalid) {
      this.markFormAsTouched();
      this.snackBar.open(
        'Por favor, completa correctamente todos los campos requeridos',
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }
    const formData = {
    ...this.userForm.value,
    phone: '+53' + this.userForm.value.phone // Agrega el +53 aquí
  };

    // Deshabilitar el botón de submit durante el envío
    this.isSubmitting = true;

    const userData = this.prepareUserData(this.userForm.value);
    const operation = this.isEditMode
      ? this.userService.updateUser(this.data.user.id.toString(), formData)
      : this.userService.createUser(userData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Usuario ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
          'Cerrar',
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.dialogRef.close(true); // Cierra el diálogo y emite true para recargar
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting = false;

        const errorMessage = this.getErrorMessage(err);
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
 
  formatPhone(event: Event): void {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, ''); 
  
  if (!/^[56]/.test(value)) {
    input.setCustomValidity('El teléfono debe empezar con 5 o 6');
  } else {
    input.setCustomValidity('');
  }
  value = value.substring(0, 8);
  this.userForm.get('phone')?.setValue(value, { emitEvent: false });
  input.value = value;
  
}
allowEditing(event: KeyboardEvent): void {
  // Permite todas las teclas de navegación y borrado
  const allowedKeys = [
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
    'Tab', 'Home', 'End'
  ];
  
  if (allowedKeys.includes(event.key)) {
    return; // Permite estas acciones
  }
  
  // Permite solo dígitos numéricos
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }
}
