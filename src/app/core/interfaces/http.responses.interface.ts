export interface SingleResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ArrayResponse<T> {
    status?: number;
    message?: string;
    data: T[];

}