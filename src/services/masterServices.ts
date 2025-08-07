import { MasterVO, MasterServiceRequest, ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/master';

/**
 * 取得師父列表
 */
export const fetchMasterList = async (): Promise<ApiResponse<MasterVO[]>> => {
  try {
    const response = await api.post(`${basePath}/list`);
    return response.data;
  } catch (error) {
    console.error('fetchMasterList error:', error);
    throw error;
  }
};

/**
 * 預約師父服務
 */
export const reserveMasterService = async (
  payload: MasterServiceRequest
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/reservation`, payload);
    return response.data;
  } catch (error) {
    console.error('reserveMasterService error:', error);
    throw error;
  }
};
