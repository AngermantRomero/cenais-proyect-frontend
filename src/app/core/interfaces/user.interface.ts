export interface User {
    id: string;
    email: string;    
    name: string;
    lastName: string;
    isActive: boolean;
    phone: string;
    role: Role | null;    
    accessToken?: string;
    
}

export interface Role {
    id: number;
    name: string;    
}
