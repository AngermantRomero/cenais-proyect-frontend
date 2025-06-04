import { Equipment } from "./equipement.interface";
import { Maker } from "./equipement.interface";
export interface Model {
  id: string; 
  modelName: string; 
  description?: string; 
  makerId: string; 
  maker: Maker; 
  equipement: Equipment[]; 
}