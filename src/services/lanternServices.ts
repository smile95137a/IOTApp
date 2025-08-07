import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/lantern';

export const getLanternList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/list`);
    return response.data;
  } catch (error) {
    console.error('getLanternList error:', error);
    throw error;
  }
};

export const getLatestLanterns = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/latest`, payload);
    return response.data;
  } catch (error) {
    console.error('getLatestLanterns error:', error);
    throw error;
  }
};

export const getRecommendationLanterns = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/recommendation`, payload);
    return response.data;
  } catch (error) {
    console.error('getRecommendationLanterns error:', error);
    throw error;
  }
};

export const getRankLanterns = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/rank`, payload);
    return response.data;
  } catch (error) {
    console.error('getRankLanterns error:', error);
    throw error;
  }
};

export const getLanternByCode = async (
  code: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/${code}`);
    return response.data;
  } catch (error) {
    console.error('getLanternByCode error:', error);
    throw error;
  }
};

export const purchaseLantern = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/purchase/info`, payload);
    return response.data;
  } catch (error) {
    console.error('purchaseLantern error:', error);
    throw error;
  }
};

export const getMyActiveLanterns = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/mine`);
    return response.data;
  } catch (error) {
    console.error('getMyActiveLanterns error:', error);
    throw error;
  }
};
