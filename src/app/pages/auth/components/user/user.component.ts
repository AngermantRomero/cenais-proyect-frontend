import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { User ,Role} from '../../../../core/interfaces/user.interface';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
@Component({
  selector: 'app-user',
  standalone: true,
   imports: [
    MatTableModule,
    MatIconModule,
    MatIconButton
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UsuariosComponent implements OnInit {
  users: (User & { showToken?: boolean} )[] = [];
  displayedColumns: string[] = ['id', 'name','lastName','isActive', 'email', 'role','phone','accessToken',]; // Ajusta según tus props

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data.map(users=>({... users,showToken:false}));
      },
      
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
  toggleTokenVisibility(user: User & { showToken?: boolean }): void {
    user.showToken = !user.showToken;
  }
   getRoleName(role: Role): string {
    return role?.name || 'Sin rol';
  }
}