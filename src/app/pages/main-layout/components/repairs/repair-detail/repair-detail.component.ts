import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RepairService } from '../../../../../core/services/repair.service';
import { Repair } from '../../../../../core/interfaces/repair.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-repair-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './repair-detail.component.html',
  styleUrls: ['./repair-detail.component.scss']
})
export class RepairDetailComponent implements OnInit {
  repair: Repair | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private repairService: RepairService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRepair(id);
    }
  }

  loadRepair(id: string): void {
    this.isLoading = true;
    this.repairService.getRepair(id).subscribe({
      next: (repair) => {
        this.repair = repair;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading repair:', error);
        this.snackBar.open('❌ Error al cargar la reparación', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/repairs']);
      }
    });
  }

  getStatusChipClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pendiente',
      'in_progress': 'En progreso',
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  }

  goBack(): void {
    this.router.navigate(['/repairs']);
  }

  editRepair(): void {
    if (this.repair) {
      this.router.navigate(['/repairs', this.repair.id, 'edit']);
    }
  }
}