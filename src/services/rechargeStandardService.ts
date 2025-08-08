import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/recharge/standard';

/**
 * 取得有效儲值方案列表
 */
export const fetchRechargeStandards = async () => {
  try {
    const response = await api.get<any[]>(basePath);
    return response.data;
  } catch (error) {
    console.error('[Recharge API] Error fetching recharge standards:', error);
    throw error;
  }
};
