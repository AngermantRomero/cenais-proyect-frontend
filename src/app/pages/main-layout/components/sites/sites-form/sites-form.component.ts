import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SiteService } from '../../../../../core/services/site.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Province, UpdateSiteDto, CreateSiteDto,Site } from '../../../../../core/interfaces/sites.interface';

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
    @Inject(MAT_DIALOG_DATA) public data: { 
      site?: UpdateSiteDto; 
      provinces: Province[] 
    }
  ) {
    this.siteForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data?.site) {
      this.isEditMode = true;
      this.patchFormWithSiteData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(10)]],
      locality: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', Validators.required]
    });
  }

  private patchFormWithSiteData(): void {
    if (!this.data.site) return;

    // Obtener el objeto Provincia completo si está disponible
    const provinceObj = typeof this.data.site.province === 'string' 
      ? this.data.provinces.find(p => p.id === this.data.site?.province)
      : this.data.site.province;

    this.siteForm.patchValue({
      code: this.data.site.code ?? '',
      locality: this.data.site.locality ?? '',
      province: provinceObj ?? '' // Asigna el objeto Provincia o su ID
    });
  }

  private getProvinceId(province: string | Province | undefined): string | undefined {
    if (!province) return undefined;
    return typeof province === 'string' ? province : province.id;
  }

  onSubmit(): void {
  if (this.siteForm.invalid) return;

  this.isSubmitting = true;
  const formData = this.prepareFormData();

  const operation = this.isEditMode 
    ? this.siteService.updateSite(
        (formData as UpdateSiteDto).id, 
        this.prepareUpdateData(formData)
    )
    : this.siteService.createSite(this.transformToOmitSite(formData as CreateSiteDto));

  operation.subscribe({
    next: () => this.handleSuccess(),
    error: (err) => this.handleError(err)
  });
}
  private transformToOmitSite(formData: CreateSiteDto): Omit<Site, "id"> {
  return {
    code: formData.code,
    locality: formData.locality,
    province: formData.province // Asegúrate que esto coincida con el tipo en Site
  };
}
  private prepareFormData(): CreateSiteDto | UpdateSiteDto {
    const formValue = this.siteForm.value;
    const provinceId = typeof formValue.province === 'string' 
    ? formValue.province 
    : formValue.province?.id;

    const baseData = {
      code: formValue.code,
      locality: formValue.locality,
      province: provinceId ?? ''
    };

    if (this.isEditMode && this.data.site?.id) {
      return {
        ...baseData,
        id: this.data.site.id
      };
    }

    return baseData;
  }

  private prepareUpdateData(formData: CreateSiteDto | UpdateSiteDto): Partial<Site> {
    if (!this.isEditMode) return formData as CreateSiteDto;
    
    const { id, ...updateData } = formData as UpdateSiteDto;
    return updateData;
  }

  private handleSuccess(): void {
    this.showSnackBar(`Sitio ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`);
    this.dialogRef.close(true);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.isSubmitting = false;
    this.showSnackBar(`Error al ${this.isEditMode ? 'actualizar' : 'crear'} el sitio`);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  private markFormAsTouched(): void {
    Object.values(this.siteForm.controls).forEach(control => control.markAsTouched());
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  compareProvinces(province1: Province | string, province2: Province | string): boolean {
    if (!province1 || !province2) return false;
    
    const id1 = typeof province1 === 'string' ? province1 : province1.id;
    const id2 = typeof province2 === 'string' ? province2 : province2.id;
    
    return id1 === id2;
  }
}