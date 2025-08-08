import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';
const basePath = '/game-records';

/**
 * 取得使用者的遊戲紀錄
 */
export const fetchGameRecords = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('[GameRecord API] Error fetching game records:', error);
    throw error;
  }
};
