import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/banners`;

/**
 * 取得所有 Banner
 */
export const fetchAllBanners = async (): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Banner API] Fetching all banners from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error fetching all banners:`, error);
    throw error;
  }
};

/**
 * 透過 ID 取得 Banner
 */
export const fetchBannerById = async (
  id: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[Banner API] Fetching banner by ID: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error fetching banner by ID:`, error);
    throw error;
  }
};

/**
 * 新增 Banner
 */
export const createBanner = async (
  bannerReq: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Banner API] Creating new banner: ${url}`, bannerReq);

  try {
    const response = await api.post(url, bannerReq);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error creating banner:`, error);
    throw error;
  }
};

/**
 * 更新 Banner
 */
export const updateBanner = async (
  id: number,
  bannerReq: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[Banner API] Updating banner: ${url}`, bannerReq);

  try {
    const response = await api.put(url, bannerReq);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error updating banner:`, error);
    throw error;
  }
};

/**
 * 刪除 Banner
 */
export const deleteBanner = async (id: number): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[Banner API] Deleting banner: ${url}`);

  try {
    const response = await api.delete(url);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error deleting banner:`, error);
    throw error;
  }
};

/**
 * 上傳 Banner 圖片
 */
export const uploadBannerImage = async (
  bannerId: number,
  imageUri: string
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}/${bannerId}/upload-image`;
  console.log(`[Banner API] Uploading banner image: ${url}`);

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: `banner_${bannerId}.jpg`,
    type: 'image/jpeg',
  });

  try {
    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Banner API] Error uploading banner image:`, error);
    throw error;
  }
};
