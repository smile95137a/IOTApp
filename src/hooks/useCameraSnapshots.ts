import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { XMLParser } from 'fast-xml-parser';
import { logJson } from '../utils/logJsonUtils';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

export const useCameraSnapshots = (cameraHost: string) => {
  const [snapshots, setSnapshots] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [channelList, setChannelList] = useState<
    { id: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 抓取通道列表
  useEffect(() => {
    if (!cameraHost) return;

    const loadChannelList = async () => {
      try {
        console.log('[useCameraSnapshots] loading channels…');
        const res = await axios.get(`${cameraHost}/GetChannelList`, {
          headers: { 'Content-Type': 'application/xml', ...AUTH_HEADER },
        });
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: '@_',
        });
        const parsed = parser.parse(res.data);
        const items = parsed?.config?.item;
        const list = Array.isArray(items) ? items : [items];
        const filtered = list
          .filter((ch) => ch['@_channelStatus'] === 'videoOn')
          .map((ch) => ({
            id: ch['#text'],
            name: ch['@_name'] || `Camera ${ch['#text']}`,
          }));
        console.log('[useCameraSnapshots] got channels:', filtered);
        setChannelList(filtered);
      } catch (err: any) {
        console.error('[useCameraSnapshots] loadChannelList error', err);
        setError('取得通道錯誤：' + err.message);
        setChannelList([]);
      }
    };

    loadChannelList();
  }, [cameraHost]);

  // 輪詢 snapshot，每秒更新一次
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (channelList.length === 0 || !cameraHost) {
      console.log(
        '[useCameraSnapshots] no channels or cameraHost, skip polling'
      );
      return;
    }

    const fetchSnapshots = async () => {
      console.log('[useCameraSnapshots] fetching snapshots…');
      try {
        const results = await Promise.all(
          channelList.map(async ({ id, name }) => {
            try {
              const res = await axios.get(
                `${cameraHost}/GetSnapshot/${id}?_=${Date.now()}`,
                { headers: AUTH_HEADER, responseType: 'blob' }
              );
              const reader = new FileReader();
              return await new Promise<{
                id: string;
                name: string;
                image: string;
              }>((resolve, reject) => {
                reader.onloadend = () =>
                  resolve({ id, name, image: reader.result as string });
                reader.onerror = reject;
                reader.readAsDataURL(res.data);
              });
            } catch {
              return { id, name, image: '' };
            }
          })
        );
        setSnapshots(results);
      } catch (e) {
        console.error('[useCameraSnapshots] fetchSnapshots error', e);
      }
    };

    fetchSnapshots();
    intervalRef.current = setInterval(fetchSnapshots, 1000);
    console.log(
      '[useCameraSnapshots] started polling, interval id =',
      intervalRef.current
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('[useCameraSnapshots] cleared polling');
      }
    };
  }, [cameraHost, channelList]);

  return { snapshots, channelList, error };
};
