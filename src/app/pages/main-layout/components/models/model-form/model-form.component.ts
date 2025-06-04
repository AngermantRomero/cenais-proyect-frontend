import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModelService } from '../../../../../core/services/model.service';
import { MakerService } from '../../../../../core/services/maker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Model } from '../../../../../core/interfaces/model.interface';
import { Maker } from '../../../../../core/interfaces/maker.interface';
import { CreateModelDto, UpdateModelDto } from '../../../../../core/interfaces/model.interface';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-model-form',
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
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss'],
})
export class ModelFormComponent implements OnInit {
  modelForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private makerService: MakerService,
    private dialogRef: MatDialogRef<ModelFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      model?: Model;
      makers: Maker[];
    }
  ) {
    this.modelForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.data?.model) {
      this.isEditMode = true;
      this.patchFormWithModelData();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      modelName: ['', [Validators.required, Validators.maxLength(45)]],
      description: ['', [Validators.maxLength(255)]],
      maker: ['', Validators.required],
    });
  }

  private patchFormWithModelData(): void {
    if (!this.data?.model) return;

    const idMaker = this.getMakerId(this.data.model.makerId);
    const makerObj = idMaker
      ? this.data.makers.find((m) => m.idMaker === idMaker)
      : null;

    this.modelForm.patchValue({
      modelName: this.data.model.modelName ?? '',
      description: this.data.model.description ?? '',
      maker: makerObj,
    });
  }

  private getMakerId(maker: string | Maker): string | null {
    if (!maker) return null;
    return typeof maker === 'string' ? maker : maker.idMaker;
  }

  onSubmit(): void {
    if (this.modelForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const formData = this.prepareFormData();
    const request$ = this.isEditMode && this.data.model?.id
      ? this.modelService.updateModel(this.data.model.id, formData as UpdateModelDto)
      : this.modelService.createModel(formData as CreateModelDto);

    request$.subscribe({
      next: () => this.handleSuccess(),
      error: (err) => this.handleError(err)
    });
  }

 private prepareFormData(): CreateModelDto | UpdateModelDto {
  const formValue = this.modelForm.value;
  const makerId = typeof formValue.maker === 'object' 
    ? formValue.maker.idMaker
    : formValue.maker;

  return {
    modelName: formValue.modelName,
    description: formValue.description || undefined,
    makerId: makerId,
  };
}

  private handleSuccess(): void {
    this.snackBar.open(
      `Modelo ${this.isEditMode ? 'actualizado' : 'creado'} correctamente`,
      'Cerrar',
      { duration: 3000 }
    );
    this.dialogRef.close(true);
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.isSubmitting = false;
    this.snackBar.open(
      `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el modelo`,
      'Cerrar',
      { duration: 3000 }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  compareMakers(maker1: Maker, maker2: Maker): boolean {
    return maker1 && maker2 ? maker1.idMaker === maker2.idMaker : false;
  }
}