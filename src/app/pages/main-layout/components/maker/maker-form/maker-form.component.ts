import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MakerService } from '../../../../../core/services/maker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Maker, Country } from '../../../../../core/interfaces/maker.interface';
import {
  CreateMakerDto,
  UpdateMakerDto,
} from '../../../../../core/interfaces/maker.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-maker-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatProgressSpinnerModule
  ],
  templateUrl: './maker-form.component.html',
  styleUrls: ['./maker-form.component.scss'],
})
export class MakerFormComponent implements OnInit {
  makerForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private makerService: MakerService,
    private dialogRef: MatDialogRef<MakerFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      maker?: Maker;
      countries: Country[];
    }
  ) {
    this.makerForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data?.maker) {
      this.isEditMode = true;
      this.patchFormWithMakerData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      brand: ['', [Validators.required, Validators.maxLength(45)]],
      description: ['', [Validators.maxLength(255)]],
      country: ['', Validators.required],
    });
  }

  private patchFormWithMakerData(): void {
    if (!this.data?.maker) return;

    const countryId = this.getCountryId(this.data.maker.country);
    const countryObj = countryId
      ? this.data.countries.find((c) => c.id === countryId)
      : null;

    this.makerForm.patchValue({
      brand: this.data.maker.brand ?? '',
      description: this.data.maker.description ?? '',
      country: countryObj,
    });
  }

  private getCountryId(country: string | Country): string | null {
    if (!country) return null;
    return typeof country === 'string' ? country : country.id;
  }

  onSubmit(): void {
    if (this.makerForm.invalid) return;

    this.isSubmitting = true;
    const formData = this.prepareFormData();

    const operation = this.isEditMode
      ? this.makerService.updateMaker(
          this.data.maker!.idMaker,
          formData as UpdateMakerDto
        )
      : this.makerService.createMaker(formData as CreateMakerDto);

    operation.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err),
    });
  }

  private prepareFormData(): CreateMakerDto | UpdateMakerDto {
    const formValue = this.makerForm.value;
    const countryId = this.getCountryId(formValue.country);

    const baseData = {
      brand: formValue.brand || undefined,
      description: formValue.description || undefined,
      country: countryId ?? '',
    };

    if (this.isEditMode && this.data.maker?.idMaker) {
      return {
        ...baseData,
        idMaker: this.data.maker.idMaker,
      } as UpdateMakerDto;
    }

    return baseData as CreateMakerDto;
  }

  private handleSuccess(): void {
    this.snackBar.open(
      `Fabricante ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
      'Cerrar',
      { duration: 3000 }
    );
    this.dialogRef.close(true);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.isSubmitting = false;
    this.snackBar.open(
      `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el fabricante`,
      'Cerrar',
      { duration: 3000 }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  compareCountries(country1: Country, country2: Country): boolean {
    return country1 && country2 ? country1.id === country2.id : false;
  }
}
