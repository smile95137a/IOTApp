import { api } from './FrontendAPI';

const basePath = '/game-order';

/**
 * 取得使用者的遊戲訂單紀錄
 */
export const fetchGameOrders = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}`);
    return response.data;
  } catch (error) {
    console.error('[GameOrder API] fetchGameOrders error:', error);
    throw error;
  }
};
