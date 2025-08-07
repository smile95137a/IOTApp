import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/poe';

// 取得擲筊排行
export const getPoeRank = async (payload: {
  count: number;
}): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/rank`, payload);
    return response.data;
  } catch (error) {
    console.error('getPoeRank error:', error);
    throw error;
  }
};

// 查詢使用者擲聖筊次數
export const getSiunnPoe = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/siunn`);
    return response.data;
  } catch (error) {
    console.error('getSiunnPoe error:', error);
    throw error;
  }
};

// 新增擲聖筊紀錄
export const addSiunnPoe = async (payload: {
  count: number;
}): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`${basePath}/siunn`, payload);
    return response.data;
  } catch (error) {
    console.error('addSiunnPoe error:', error);
    throw error;
  }
};

// 新增一般擲筊紀錄
export const addNormalPoe = async (payload: {
  count: number;
}): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`${basePath}/throws/normal`, payload);
    return response.data;
  } catch (error) {
    console.error('addNormalPoe error:', error);
    throw error;
  }
};

// 查詢使用者一般擲筊次數
export const getNormalPoe = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/throws/normal`);
    return response.data;
  } catch (error) {
    console.error('getNormalPoe error:', error);
    throw error;
  }
};
