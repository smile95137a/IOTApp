import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/news`;

export interface News {
  [key: string]: any;
}

export interface NewsRequest {
  [key: string]: any;
}

/**
 * 取得所有新聞
 */
export const fetchAllNews = async (): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[News API] Fetching all news from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error fetching all news:`, error);
    throw error;
  }
};

/**
 * 根據 ID 取得新聞
 */
export const fetchNewsById = async (
  uid: string
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[News API] Fetching news by ID: ${uid} from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error fetching news by ID:`, error);
    throw error;
  }
};

/**
 * 根據狀態取得新聞
 */
export const fetchNewsByStatus = async (
  status: string
): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}/status/${status}`;
  logJson(`[News API] Fetching news by status: ${status} from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error fetching news by status:`, error);
    throw error;
  }
};

/**
 * 新增新聞
 */
export const createNews = async (
  news: NewsRequest
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[News API] Creating news at: ${url}`);

  try {
    const response = await api.post(url, news);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error creating news:`, error);
    throw error;
  }
};

/**
 * 更新新聞
 */
export const updateNews = async (
  uid: number,
  news: NewsRequest
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[News API] Updating news ID: ${uid} at: ${url}`);
  logJson(`[News API] Updating news ID: ${news}`);

  try {
    const response = await api.put(url, news);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error updating news:`, error);
    throw error;
  }
};

/**
 * 根據 ID 刪除新聞
 */
export const deleteNewsById = async (
  uid: string
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[News API] Deleting news ID: ${uid} from: ${url}`);

  try {
    const response = await api.delete(url);
    logJson(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[News API] Error deleting news:`, error);
    throw error;
  }
};

/**
 * 上傳新聞圖片
 */
export const uploadNewsImages = async (
  userId: number,
  imageUri: string
): Promise<boolean> => {
  const url = `${API_BASE_URL}${basePath}/${userId}/upload-image`;
  logJson(`[NEWS API] Uploading profile image for user: ${userId} to ${url}`);

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `news_${userId}.jpg`,
      type: 'image/jpeg',
    });

    logJson(`[NEWS API] FormData:`, formData);

    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    logJson(`[NEWS API] Profile Image Upload Success:`, response.data);
    return response.status === 200;
  } catch (error) {
    logJson(`[NEWS API] Error uploading profile image:`, error);
    return false;
  }
};
