export interface ArrayResponse<T> {
  data: T[];
  message: string;
  success: boolean;
}