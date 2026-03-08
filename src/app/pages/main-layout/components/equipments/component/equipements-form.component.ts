import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentService } from '../../../../../core/services/equipement.service';
import { Equipment } from '../../../../../core/interfaces/equipement.interface';
import { Maker } from '../../../../../core/interfaces/equipement.interface';
import { TypeEquipement } from '../../../../../core/interfaces/equipement.interface';
import { EquipmentModel } from '../../../../../core/interfaces/equipement.interface';
import { EquipmentState } from '../../../../../core/interfaces/equipement.interface';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Site,Province } from '../../../../../core/interfaces/sites.interface';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    
    MatButtonModule,
    MatFormFieldModule,
  ],
  selector: 'app-equipment-form',
  templateUrl: './equipements-form.component.html',
  styleUrls: ['./equipements-form.componet.scss']
})
export class EquipmentFormComponent implements OnInit {
  equipmentForm: FormGroup;
  isEditMode = false;
  makers: Maker[] = [];
  models: EquipmentModel[] = [];
  types: TypeEquipement[] = [];
  states: EquipmentState[] = [];
  sites: Site[]=[];

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    @Optional() public dialogRef: MatDialogRef<EquipmentFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { equipment: Equipment }
  ) {
    this.equipmentForm = this.fb.group({
      serialNumber: ['', Validators.required],
      inventoryNumber: ['', Validators.required],
      startOfOperation: ['', Validators.required],
      makerId: ['', Validators.required],
      modelId: ['', Validators.required],
      typeEquipementId: ['', Validators.required],
      initialStateId: ['', Validators.required],
      siteId:['']
    });
    
  }
  

  ngOnInit(): void {
    this.loadDropdownData();
    
    if (this.data?.equipment) {
      this.isEditMode = true;
      this.patchFormValues(this.data.equipment);
    }
  }
  getProvinceName(site: Site): string {
  if (!site?.province) return '';
  
  // Verificar si province es un objeto (tiene propiedad 'name')
  if (typeof site.province === 'object' && 'name' in site.province) {
    return site.province.name;
  }
  

  return '';
}

  loadDropdownData(): void {
    // Estos métodos deberían implementarse en el EquipmentService
    this.equipmentService.getMakers().subscribe(makers => this.makers = makers);
    this.equipmentService.getModels().subscribe(models => this.models = models);
    this.equipmentService.getEquipmentTypes().subscribe(types => this.types = types);
    this.equipmentService.getEquipmentStates().subscribe(states => this.states = states);
    this.equipmentService.getAvailableSites().subscribe(sites => this.sites = sites);
  }

  patchFormValues(equipment: Equipment): void {
    this.equipmentForm.patchValue({
      serialNumber: equipment.serialNumber,
      inventoryNumber: equipment.inventoryNumber,
      startOfOperation: equipment.startOfOperation,
      makerId: equipment.maker.idMaker,
      modelId: equipment.model.id,
      typeEquipementId: equipment.typeEquipement?.id,
       initialStateId: equipment.currentState?.id,
       siteId: equipment.site?.id || '' 
    });
  }

 onSubmit(): void {
  if (this.equipmentForm.valid) {
    const formValue = this.equipmentForm.value;
    
    // Formatear fecha
    const payload = {
      ...formValue,
      startOfOperation: new Date(formValue.startOfOperation)
        .toISOString().split('T')[0]
    };

    if (this.isEditMode) {
      // Mapear initialStateId a currentStateId para update
      const updatePayload = {
        ...payload,
        currentStateId: payload.initialStateId
      };
      delete updatePayload.initialStateId;
      
      this.equipmentService.updateEquipment(this.data.equipment.id, updatePayload)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error updating:', err)
        });
    } else {
      this.equipmentService.createEquipment(payload)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Error creating:', err)
        });
    }
  }
}

  onCancel(): void {
    this.dialogRef.close(false);
  }
}