
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialogModule } from '@angular/material/dialog';
import { Site,Province} from '../../../../../core/interfaces/sites.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProvincesService } from '../../../../../core/services/province.service';
@Component({
  selector: 'app-site-form',
  standalone: true,
   imports: [ // Módulos necesarios para el diálogo
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './sites-form.component.html',
  styleUrls: ['./sites-form.component.scss'],
})
export class SiteFormComponent {
   site: Partial<Site> = {}; // Inicializa vacío
  provinces: Province[] = []; // Inicializa vacío


   constructor(
    @Inject(MAT_DIALOG_DATA) public data: { site?: Site }, 
    private provincesService: ProvincesService,
    private dialogRef: MatDialogRef<SiteFormComponent> 
  ) {
    this.site = data?.site || {}; 
  }

  ngOnInit(): void {
    this.loadProvinces(); 
  }

  loadProvinces(): void {
    this.provincesService.getProvinces().subscribe(
      (provinces) => this.provinces = provinces
    );
  }
   onSave(): void {
    if (this.site.code && this.site.locality && this.site.province) {
      this.dialogRef.close(this.site); 
    }
  }
}
