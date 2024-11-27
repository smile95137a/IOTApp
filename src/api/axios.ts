import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { jwtDecode } from 'jwt-decode';

const SERVER_URL = 'https://localhost:8081'; 
export const baseURL = SERVER_URL + '/api/v1/';

// Tạo các instance của Axios
export const axiosNoToken = axios.create({
  baseURL,
//   withCredentials: true,
});

export const axiosToken = axios.create({
  baseURL,
//   withCredentials: true,
});

axiosToken.interceptors.request.use(async (config) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const date = new Date();

  if (accessToken) {
    const decodedToken: any = jwtDecode(accessToken);

    if (decodedToken.exp < date.getTime() / 1000) {
      try {
        const resp: { accessToken: string } = await axiosNoToken.post('/auth/token/refresh');
        await AsyncStorage.setItem('accessToken', resp.accessToken);
      } catch (error) {
        console.error('Token refresh failed:', error);
        await AsyncStorage.removeItem('accessToken');
      }
    }
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor để xử lý lỗi 401
axiosToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('You are not authorized. Removing access token.');
      await AsyncStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);
