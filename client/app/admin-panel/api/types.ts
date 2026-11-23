export interface ApiMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta;
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  [key: string]: string | number | boolean | undefined;
}
