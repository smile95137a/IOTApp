import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
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
}

const basePath = `/news`;

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

export const fetchNewsById = async (
  uid: string
): Promise<ApiResponse<News>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(`[News API] Fetching news by ID: ${uid}, URL: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response for ID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by ID ${uid}:`, error);
    throw error;
  }
};

export const fetchNewsByStatus = async (
  status: string
): Promise<ApiResponse<News[]>> => {
  const url = `${API_BASE_URL}${basePath}/status/${status}`;
  console.log(`[News API] Fetching news by status: ${status}, URL: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[News API] Response for status ${status}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[News API] Error fetching news by status ${status}:`, error);
    throw error;
  }
};
