import { api } from './FrontAPI';
import { ApiResponse } from '@/vite-env';

const basePath = '/payment';

export const markVirtualPaymentSuccess = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`${basePath}/virtual/success`, payload);
    return response.data;
  } catch (error) {
    console.error('markVirtualPaymentSuccess error:', error);
    throw error;
  }
};
