import { Store } from '@/api/storeApi';

/**
 * 計算兩個經緯度之間的距離（Haversine 公式）
 * @param lat1 第一個點的緯度
 * @param lon1 第一個點的經度
 * @param lat2 第二個點的緯度
 * @param lon2 第二個點的經度
 * @returns 兩點之間的距離（單位：公里）
 */
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadian = (angle: number): number => (Math.PI / 180) * angle;
  const R = 6371; // 地球半徑（公里）

  const φ1 = toRadian(lat1);
  const φ2 = toRadian(lat2);
  const Δφ = toRadian(lat2 - lat1);
  const Δλ = toRadian(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 回傳距離 (公里)
};

/**
 * 根據當前位置，找出最近的兩家門市
 * @param userLat 使用者的緯度
 * @param userLon 使用者的經度
 * @param stores 門市清單 (包含經緯度)
 * @returns 回傳最近的兩家門市
 */
export const findNearestStores = (
  userLat: number,
  userLon: number,
  stores: Store[]
) => {
  const arr = stores.map((store) => ({
    ...store,
    distance: haversineDistance(userLat, userLon, store.lat, store.lon),
  }));
  return arr;
};
