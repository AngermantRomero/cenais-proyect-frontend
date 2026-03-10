import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RepairService } from '../../../../../core/services/repair.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EquipmentService } from '../../../../../core/services/equipement.service';
import { Repair } from '../../../../../core/interfaces/repair.interface';
import { User } from '../../../../../core/interfaces/user.interface';
import { UserService } from '../../../../../core/services/user.service';

@Component({
  selector: 'app-repair-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './repair-form.component.html',
  styleUrls: ['./repair-form.component.scss'],
})
export class RepairFormComponent implements OnInit {
  repairForm: FormGroup;
  isEditMode = false;
  equipments: any[] = [];
  technicians: User[] = [];
  statuses = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
  ];

  constructor(
    private fb: FormBuilder,
    private repairService: RepairService,
    private equipmentService: EquipmentService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<RepairFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: string; repair?: Repair },
  ) {
    this.isEditMode = data.mode === 'edit';

    this.repairForm = this.fb.group({
      equipmentId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5)]],
      startDate: [new Date(), Validators.required],
      endDate: [''],
      status: ['pending'],
      technicianId: [null],
      observations: [''],
    });
  }

  ngOnInit(): void {
    this.loadEquipments();
    this.loadTechnicians();
    if (this.isEditMode && this.data.repair) {
    console.log('📦 Datos de reparación a editar:', this.data.repair);
    console.log('📅 Fecha inicio original:', this.data.repair.startDate);
    console.log('📅 Fecha fin original:', this.data.repair.endDate);
      this.patchFormValues(this.data.repair);
    }
  }

  loadEquipments(): void {
    this.equipmentService.getEquipments().subscribe({
      next: (equipments) => {
        this.equipments = equipments;
      },
      error: (err) => console.error('Error loading equipments:', err),
    });
  }
  loadTechnicians(): void {
    this.userService.getTechnicians().subscribe({
      next: (response) => {
        this.technicians = response.data;
        console.log('👥 Técnicos cargados:', this.technicians);
      },
      error: (err) => {
        console.error('Error loading technicians:', err);
        this.snackBar.open('❌ Error al cargar técnicos', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  patchFormValues(repair: Repair): void {
      console.log('🔄 Aplicando patch con:', repair);
        // Intentar diferentes formas de parsear la fecha
  let startDate = null;
  if (repair.startDate) {
    // Si viene como string YYYY-MM-DD
    if (typeof repair.startDate === 'string') {
      const [year, month, day] = repair.startDate.split('-');
      startDate = new Date(parseInt(year), parseInt(month)-1, parseInt(day));
      console.log('📅 StartDate parseado:', startDate);
    }
  }
  let endDate = null;
  if (repair.endDate) {
    if (typeof repair.endDate === 'string') {
      const [year, month, day] = repair.endDate.split('-');
      endDate = new Date(parseInt(year), parseInt(month)-1, parseInt(day));
      console.log('📅 EndDate parseado:', endDate);
    }
  }



    this.repairForm.patchValue({
      equipmentId: repair.equipmentId,
      description: repair.description,
      startDate: startDate,
      endDate: endDate,
      status: repair.status,
      technicianId: repair.technicianId || null,
      observations: repair.observations || '',
    });
  }

  onSubmit(): void {
    if (this.repairForm.valid) {
      const formValue = this.repairForm.value;

      // Formatear fechas
      const payload:any = {
        description: formValue.description.trim(),
        equipmentId: formValue.equipmentId,
        startDate: new Date(formValue.startDate).toISOString().split('T')[0],
        status: formValue.status || 'pending',
      };

      if (formValue.endDate) {
        payload.endDate = new Date(formValue.endDate)
          .toISOString()
          .split('T')[0];
      }
      if (formValue.technicianId) {
        payload.technicianId = formValue.technicianId;
      }

      // Solo agregar observations si tiene valor
      if (formValue.observations?.trim()) {
        payload.observations = formValue.observations.trim();
      }

      if (this.isEditMode && this.data.repair) {
        this.repairService.updateRepair(this.data.repair.id, payload).subscribe({
          next: () => {
            this.snackBar.open('✅ Reparación actualizada', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('❌ Error updating:', err.error);
            const errorMsg = err.error?.message?.[0] || err.error?.message || 'Error desconocido';
            this.snackBar.open(`❌ Error: ${errorMsg}`, 'Cerrar', { duration: 5000 });
          }
        });
      } else {
        // CREATE
        this.repairService.createRepair(payload).subscribe({
          next: () => {
            this.snackBar.open('✅ Reparación creada', 'Cerrar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('❌ Error creating:', err.error);
            const errorMsg = err.error?.message?.[0] || err.error?.message || 'Error desconocido';
            this.snackBar.open(`❌ Error: ${errorMsg}`, 'Cerrar', { duration: 5000 });
          },
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
