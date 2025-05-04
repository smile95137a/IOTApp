import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export const getImageUrl = (imagePath: string): string => {
  return `${API_BASE_URL}/img${imagePath}`;
};
