import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User, Role } from '../interfaces/user.interface'; 
import { ArrayResponse, SingleResponse } from '../interfaces/http.responses.interface';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

type RoleName = 'Administrator' | 'Guest' | 'Technician';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiBaseUrl = environment.apiUrl;
  private readonly endpoints = environment.endpoints;
   private readonly roleTranslationMap: { [key: string]: string } = {
    'Administrator': 'Administrador',
    'Guest': 'Invitado',
    'Technician': 'Técnico'
  };
  
  
  constructor(private http: HttpClient) {}
   private translateRoleName(name: string): string {
    return this.roleTranslationMap[name] || name;
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
      
      // Puedes personalizar mensajes según códigos de estado
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
      }
      
      // Si el backend devuelve un mensaje de error personalizado
      if (error.error?.message) {
        errorMessage += `\nDetalles: ${error.error.message}`;
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

 getUsers(): Observable<ArrayResponse<User>> {
  const url = `${this.apiBaseUrl}${this.endpoints.users}`;
  
  // 1. Definimos el tipo explícito para las traducciones
  type RoleName = 'Administrator' | 'Guest' | 'Technician';
  const roleTranslations: Record<RoleName, string> = {
    'Administrator': 'Administrador',
    'Guest': 'Invitado',
    'Technician': 'Técnico'
  };

  // 2. Función segura para traducir
  const translateRoleName = (name: string): string => {
    // Verificamos que el nombre esté en las claves permitidas
    if (Object.keys(roleTranslations).includes(name as RoleName)) {
      return roleTranslations[name as RoleName];
    }
    return name; // Devuelve el original si no hay traducción
  };


return this.http.get<ArrayResponse<User>>(url).pipe(
  map((response: ArrayResponse<User>) => {
    const transformedData: User[] = response.data.map(user => {
      // Verificación segura del rol y traducción
      if (!user.role) {
        return { ...user, role: null };
      }
      
      return {
        ...user,
        role: {
          ...user.role,
          name: translateRoleName(user.role.name)
        }
      };
    });
    
    return {
      ...response,
      data: transformedData
    };
  }),
  catchError(this.handleError)
);
}
   getUsersByRole(role: RoleName): Observable<ArrayResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}`;
    
    return this.http.get<ArrayResponse<User>>(url).pipe(
      map((response: ArrayResponse<User>) => {
        
        const filteredData = response.data.filter(user => 
          user.role?.name === role
        );
        
        const transformedData = filteredData.map(user => ({
          ...user,
          role: user.role ? {
            ...user.role,
            name: this.translateRoleName(user.role.name)
          } : null
        }));
        
        return {
          ...response,
          data: transformedData
        };
      }),
      catchError(this.handleError)
    );
  }
  getTechnicians(): Observable<ArrayResponse<User>> {
  return this.getUsersByRole('Technician');
}
getAdministrators(): Observable<ArrayResponse<User>> {
  return this.getUsersByRole('Administrator');
}

getGuests(): Observable<ArrayResponse<User>> {
  return this.getUsersByRole('Guest');
}
  createUser(userData: Omit<User, 'id'>): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.auth}/register`;
    return this.http.post<SingleResponse<User>>(url, userData).pipe(
      catchError(this.handleError)
    );
  }

  getRoles(): Observable<ArrayResponse<Role>> {
    const url = `${this.apiBaseUrl}${this.endpoints.roles}`;
    const roleTranslationMap: { [key: string]: string } = {
      'Administrator': 'Administrador',
      'Guest': 'Invitado',
      'Technician': 'Técnico'
    };

    return this.http.get<ArrayResponse<Role>>(url).pipe(
      map(response => ({
        ...response,
        data: response.data.map(role => ({
          ...role,
          name: roleTranslationMap[role.name] || role.name
        }))
      })),
      catchError(this.handleError)
    );
  }

  updateUser(id: string, userData: Partial<User>): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`;
    return this.http.patch<SingleResponse<User>>(url, userData).pipe(
      catchError(this.handleError)
    );
  }

  updateUserStatus(id: string, isActive: boolean): Observable<User> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`;
    return this.http.patch<SingleResponse<User>>(url, { isActive }).pipe(
      map(response => response.data),
      catchError(this.handleError)
    );
  }

  deleteUser(id: string): Observable<SingleResponse<User>> {
    const url = `${this.apiBaseUrl}${this.endpoints.users}/${id}`;
    return this.http.delete<SingleResponse<User>>(url).pipe(
      catchError(this.handleError)
    );
  }
}