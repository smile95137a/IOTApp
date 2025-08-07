// src/services/front/calendarService.ts
import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/calendar';

export interface ChineseCalendarRequest {
  year: number;
  month: number;
  day: number;
}

export const queryChineseCalendar = async (
  payload: ChineseCalendarRequest
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/query`, payload);
    return response.data;
  } catch (error) {
    console.error('queryChineseCalendar error:', error);
    throw error;
  }
};
