import { Equipment } from "./equipement.interface";
import { Maker } from "./equipement.interface";
export interface Model {
  id: string; 
  modelName: string; 
  description?: string; 
  makerId: string; 
  makerBrand?: string;
  maker: Maker; 
  equipement: Equipment[]; 
}
export interface CreateModelDto {
  modelName: string;
  description?: string;
  makerId: string;
}

export interface UpdateModelDto {
  modelName?: string;
  description?: string;
  makerId?: string;
}

export interface ModelFiltersDto {
  modelName?: string;
  description?: string;
  makerId?: string;
}