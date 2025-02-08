declare module '@env' {
  export const API_BASE_URL: string;
}
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errorCode?: number;
}
