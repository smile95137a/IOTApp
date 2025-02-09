import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/news`;

export interface News {
  id: number;
  uid: string;
  title: string;
  content: string;
  status: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NewsRequest {
  title: string;
  content: string;
  status: string;
}

/**
 * 取得所有新聞
 */
export const fetchAllNews = async (): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[News API] Fetching all news from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching all news:`, error);
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
  console.log(`[News API] Fetching news by ID: ${uid} from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by ID:`, error);
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
  console.log(`[News API] Fetching news by status: ${status} from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by status:`, error);
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
  console.log(`[News API] Creating news at: ${url}`);

  try {
    const response = await api.post(url, news);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error creating news:`, error);
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
  console.log(`[News API] Updating news ID: ${uid} at: ${url}`);
  console.log(`[News API] Updating news ID: ${news}`);

  try {
    const response = await api.put(url, news);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error updating news:`, error);
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
  console.log(`[News API] Deleting news ID: ${uid} from: ${url}`);

  try {
    const response = await api.delete(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error deleting news:`, error);
    throw error;
  }
};

/**
 * 上傳新聞圖片
 */
export const uploadNewsImages = async (
  id: number,
  files: File[]
): Promise<ApiResponse<string[]>> => {
  const url = `${API_BASE_URL}${basePath}/${id}/upload-profile-image`;
  console.log(`[News API] Uploading images for news ID: ${id} at: ${url}`);

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });

  try {
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error uploading images:`, error);
    throw error;
  }
};
