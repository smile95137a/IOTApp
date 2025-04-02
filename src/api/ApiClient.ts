import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logJson } from '@/utils/logJsonUtils';

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    console.log(
      `[API Error] ${error.config?.url}:`,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);
