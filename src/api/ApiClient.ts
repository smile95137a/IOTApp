import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

// ✅ 建立 Axios 實例
export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 在每個請求前加上 Authorization Token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[API Request] Authorization: Bearer ${token}`);
  }
  return config;
});

// ✅ 在每個回應後加上 log
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(
      `[API Error] ${error.config?.url}:`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);
