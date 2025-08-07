import { api } from './FrontendAPI';

const basePath = '/gamePay';

export const checkoutGameGamePay = async (data: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(`${basePath}`, data);
    return response.data;
  } catch (error) {
    console.error('[GamePay API] checkoutGameGamePay error:', error);
    throw error;
  }
};
