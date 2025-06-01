export interface Site {
  id: string;
  locality: string;
  code: string;
  province: Province | string;
}

export interface Province {
  id: string;
  name: string; 
}

export interface CreateSiteDto {
  locality: string;
  code: string;
  province: string; 
}


export interface UpdateSiteDto {
  id: string;
  locality?: string;
  code?: string;
  province?: string | Province; 
}