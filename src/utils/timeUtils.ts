import moment from 'moment';

export const hours = Array.from({ length: 24 }, (_, i) => i);
export const minutes = Array.from({ length: 60 }, (_, i) => i);

/**
 * 拆解時間字串成時與分
 * @param timeStr 例如 '08:30'
 */
export const splitTime = (timeStr: string) => {
  const [hour, minute] = timeStr.split(':');
  return { hour: parseInt(hour, 10), minute: parseInt(minute, 10) };
};

/**
 * 將時與分格式化為 'HH:mm'
 */
export const formatTime = (hour: number, minute: number): string =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

/**
 * 驗證時間字串是否為合法 HH:mm 格式
 * @param time 時間字串，例如 '08:30'
 * @returns true 表示合法
 */
export const isValidTime = (time: string): boolean => {
  return moment(time, 'HH:mm', true).isValid();
};
