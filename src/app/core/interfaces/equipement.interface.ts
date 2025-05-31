// interfaces/equipment.interface.ts
export interface Country {
  id: string;
  name: string;
}

export interface Maker {
  idMaker: string;
  brand: string;
  description: string;
  country: Country;
}

export interface EquipmentModel {
  id: string;
  modelName: string;
  description: string;
  makerId: string;
  makerBrand: string;
}

export interface TypeEquipment {
  id: string;
  description: string;
}

export interface EquipmentState {
  id: string;
  name: string;
  color?: string;
}

export interface Equipment {
  id: string;
  serialNumber: string;
  inventoryNumber: string;
  startOfOperation: string;
  maker: Maker;
  model: EquipmentModel;
  typeEquipment: TypeEquipment;
  currentState: EquipmentState;
  stateHistory: Array<{
    id: string;
    date: string;
    state: EquipmentState;
  }>;
}