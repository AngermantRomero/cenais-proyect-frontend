import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, Role } from '../../../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserFormComponent } from './components/user-form/user-form.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = [
    'name',
    'lastName',
    'isActive',
    'email',
    'role',
    'phone',
    'actions',
  ];
    statusLoading: Record<string, boolean> = {};

  constructor(
    private userService: UserService,
    private dialog: MatDialog,

    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  onStatusChange(event: MatSlideToggleChange, user: User): void {
    const userId = user.id.toString();
    this.statusLoading[user.id] = true;
    
    this.userService.updateUserStatus(userId, event.checked).subscribe({
      next: (updatedUser) => {
        user.isActive = updatedUser.isActive;
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
      },
      error: (err:HttpErrorResponse) => {
        event.source.checked = !event.checked;
         user.isActive = !user.isActive;
          this.snackBar.open(err.error?.message || err.message || 'Error desconocido', 'Cerrar', {
    duration: 3000
  });
      },
      complete: () => this.statusLoading[user.id] = false
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);

        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '680px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  getUserStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }

  deleteUser(user: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
              duration: 3000,
            });
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            //this.toastr.error('Error al eliminar usuario', 'Error');
            this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
        duration: 3000
            });
          }
        });
      }
    });
  }
}