export interface Site {
  id: string;
  locality: string;
  code: string;
  province: Province ;
}

export interface Province {
  id: string;
  name: string; 
}

export interface CreateSiteDto {
  locality: string;
  code: string;
  province: string | Province; 
  id?: string;  
}

export interface UpdateSiteDto extends Partial<CreateSiteDto> {}