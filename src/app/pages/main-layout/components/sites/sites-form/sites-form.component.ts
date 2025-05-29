import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Site } from '../../../../../core/interfaces/sites.interface'; 
import { Province } from '../../../../../core/interfaces/sites.interface';
import { SiteService } from '../../../../../core/services/site.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './sites-form.component.html',
  styleUrls: ['./sites-form.component.scss']
})
export class SiteFormComponent implements OnInit {
  siteForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private siteService: SiteService,
    private dialogRef: MatDialogRef<SiteFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { site?: Site, provinces: Province[] }
  ) {
    this.siteForm = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      locality: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data?.site) {
      this.isEditMode = true;
      this.siteForm.patchValue({
        code: this.data.site.code,
        locality: this.data.site.locality,
        province: this.data.site.province
      });
    }
  }

  onSubmit(): void {
    if (this.siteForm.invalid) {
      this.markFormAsTouched();
      this.snackBar.open(
        'Por favor, completa correctamente todos los campos requeridos',
        'Cerrar',
        { duration: 3000 }
      );
      return;
    }

    this.isSubmitting = true;
    const formData = this.siteForm.value;

    const operation = this.isEditMode
      ? this.siteService.updateSite(this.data.site!.id, formData)
      : this.siteService.createSite(formData);

    operation.subscribe({
      next: () => {
        this.snackBar.open(
          `Sitio ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error:', err);
        this.isSubmitting = false;
        this.snackBar.open(
          `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el sitio`,
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
  }

  private markFormAsTouched(): void {
    Object.values(this.siteForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}