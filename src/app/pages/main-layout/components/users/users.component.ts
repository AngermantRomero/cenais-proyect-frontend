import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User, Role } from '../../../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from './components/user-form/user-form.component';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['name', 'lastName', 'isActive', 'email', 'role', 'phone','actions'];

  constructor(private userService: UserService,private dialog:MatDialog) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
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
    }
  });
}
   openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '680px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe((result:boolean) => {
      if (result) {
        this.loadUsers(); 
      }
    });
  }

  getUserStatusIcon(isActive: boolean): string {
    return isActive ? 'check_circle' : 'cancel';
  }
}