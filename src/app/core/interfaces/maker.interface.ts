import { Equipment } from "./equipement.interface";
import { Model } from "./model.interface";

export interface Country {
  id: string;
  countryName: string;
}


export interface Maker {
  idMaker: string; // UUID del fabricante
  brand?: string; // Marca (puede ser opcional)
  description?: string; // Descripción del fabricante
  country: Country; // País asociado
  models?: Model[]; // Modelos asociados
  equipment?: Equipment[]; // Equipos relacionados
}


export interface CreateMakerDto {
  brand: string;
  description?: string;
  countryName: string;
}
export interface UpdateMakerDto extends Partial<CreateMakerDto> {
  idMaker: string; 
}
