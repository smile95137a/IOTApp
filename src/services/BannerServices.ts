// src/services/front/bannerServices.ts
import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/banner';

export const getAllBanners = async () => {
  try {
    const response = await api.get<ApiResponse<any[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('[Banner API] Error fetching banners:', error);
    throw error;
  }
};
