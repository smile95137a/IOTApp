import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/news';

export const getAllNews = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching all news:', error);
    throw error;
  }
};

export const getNewsById = async (
  newsUid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${newsUid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with ID ${newsUid}:`, error);
    throw error;
  }
};

export const getNewsByStatus = async (
  status: string
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `${basePath}/status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching news with status ${status}:`, error);
    throw error;
  }
};

export const getAllNewsNoUser = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/query`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all news (no user):', error);
    throw error;
  }
};

export const getNewsByIdNoUser = async (
  newsUid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/query/${newsUid}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching news by ID (no user) ${newsUid}:`, error);
    throw error;
  }
};

export const getNewsByStatusNoUser = async (
  status: string
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `${basePath}/query/status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching news by status (no user) ${status}:`, error);
    throw error;
  }
};

export const getDisplayNews = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get<ApiResponse<any[]>>(`${basePath}/display`);
    return response.data;
  } catch (error) {
    console.error('Error fetching display news:', error);
    throw error;
  }
};
