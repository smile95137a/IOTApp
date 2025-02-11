import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface News {
  id: number;
  newsUid: string;
  title: string;
  content: string;
  imageUrls: string[];
  status: string;
  createdDate: string;
  updatedDate?: string;
  author: string;
  isRead?: boolean;
}

const basePath = `/news`;

// 獲取所有新聞
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

// 根據 ID 獲取新聞並標記為已讀
export const fetchNewsById = async (
  newsUid: string
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}/${newsUid}`;
  console.log(`[News API] Fetching news by ID from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by ID:`, error);
    throw error;
  }
};

// 根據狀態獲取新聞
export const fetchNewsByStatus = async (
  status: string
): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}/status/${status}`;
  console.log(`[News API] Fetching news by status from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by status:`, error);
    throw error;
  }
};

// 獲取所有新聞（不考慮用戶登入狀態）
export const fetchAllNewsNoUser = async (): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}/query`;
  console.log(`[News API] Fetching all news (no user) from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching all news (no user):`, error);
    throw error;
  }
};

// 根據 ID 獲取新聞（不考慮用戶登入狀態）
export const fetchNewsByIdNoUser = async (
  newsUid: string
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}/query/${newsUid}`;
  console.log(`[News API] Fetching news by ID (no user) from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by ID (no user):`, error);
    throw error;
  }
};

// 根據狀態獲取新聞（不考慮用戶登入狀態）
export const fetchNewsByStatusNoUser = async (
  status: string
): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}/query/status/${status}`;
  console.log(`[News API] Fetching news by status (no user) from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by status (no user):`, error);
    throw error;
  }
};
