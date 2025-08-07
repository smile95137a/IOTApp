// src/services/front/godServices.ts
import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/god';

export const fetchAllGod = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/list`);
    return response.data;
  } catch (error) {
    console.error('fetchAllGod error:', error);
    throw error;
  }
};

export const godDescend = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/descend`, payload);
    return response.data;
  } catch (error) {
    console.error('godDescend error:', error);
    throw error;
  }
};

export const getGodInfo = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/info`, payload);
    return response.data;
  } catch (error) {
    console.error('getGodInfo error:', error);
    throw error;
  }
};

export const fetchOfferingList = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/offering/list`);
    return response.data;
  } catch (error) {
    console.error('fetchOfferingList error:', error);
    throw error;
  }
};

export const presentOffering = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/offering/present`, payload);
    return response.data;
  } catch (error) {
    console.error('presentOffering error:', error);
    throw error;
  }
};
