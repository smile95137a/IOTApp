// src/services/front/poemServices.ts
import { ApiResponse, Poem } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/poem';

/**
 * 隨機抽取詩籤
 */
export const getRandomPoem = async (): Promise<ApiResponse<Poem>> => {
  try {
    const response = await api.post<ApiResponse<Poem>>(`${basePath}/drawing`);
    return response.data;
  } catch (error) {
    console.error('getRandomPoem error:', error);
    throw error;
  }
};
