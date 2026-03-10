export interface Repair {
  id: string;
  startDate: string;
  endDate?: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  observations?: string;
  
  
  equipment: {
    id: string;
    serialNumber: string;
    inventoryNumber: string;
    model: {
    id: string;
      modelName: string;
    };
    maker: {
      brand: string;
      idMaker:string;
    };
  };
  equipmentId: string;
  
  technician: {
    id: string;
    name: string;
    email: string;
     role?: {
      name: string;
    };
  };
  technicianId?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateRepairDto {
  startDate: string;
  endDate?: string;
  description: string;
  equipmentId: string;
  technicianId?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  observations?: string;
}

export type UpdateRepairDto = Partial<CreateRepairDto>;

export interface RepairFilter {
  equipmentId?: string;
  technicianId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}