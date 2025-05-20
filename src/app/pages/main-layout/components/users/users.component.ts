import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, Role } from '../../../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Añadido MatDialogModule
import { UserFormComponent } from './components/user-form/user-form.component';
//import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule, // Añadido aquí
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'lastName', 'isActive', 'email', 'role', 'phone', 'actions'];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    //private toastr: ToastrService
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  getRoleName(role: Role): string {
    return role?.name || 'Sin rol';
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        //this.toastr.error('Error al cargar usuarios', 'Error');
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '680px',
      data: { user }
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
        message: `¿Estás seguro de que quieres eliminar a ${user.name} ${user.lastName}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            //this.toastr.success('Usuario eliminado correctamente', 'Éxito');
            this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
        duration: 3000
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