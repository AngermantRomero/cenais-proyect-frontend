export interface Site {
  id: string;
  locality: string;
  code: string;
  province: Province;
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
export interface ApiResponse {
  lists: Site[];  
  provinces: Province[];
}
export interface UpdateSiteDto extends Partial<CreateSiteDto> {}