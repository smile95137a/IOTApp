import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { XMLParser } from 'fast-xml-parser';
import { logJson } from '../utils/logJsonUtils';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

const ensureHttpPrefix = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`;
  }
  return url;
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
  const cameraHostWithProtocol = ensureHttpPrefix(cameraHost);

  useEffect(() => {
    if (!cameraHost) return;
    const loadChannelList = async () => {
      try {
        console.log('[useCameraSnapshots] loading channels…');
        console.log(`[API] GET ${cameraHostWithProtocol}/GetChannelList`);

        const res = await axios.get(
          `${cameraHostWithProtocol}/GetChannelList`,
          {
            headers: { 'Content-Type': 'application/xml', ...AUTH_HEADER },
          }
        );
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
        console.log('[useCameraSnapshots] loadChannelList error', err);
        setError('取得通道錯誤：' + err.message);
        setChannelList([]); // 清空，但會繼續 retry
      }
    };

    loadChannelList();
  }, [cameraHost]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const fetchSnapshots = async () => {
      console.log('[useCameraSnapshots] fetching snapshots…');

      if (!cameraHost) return;

      try {
        // 如果 channel list 是空的，嘗試重新取得
        const channelsToUse = channelList.length
          ? channelList
          : await reloadChannels();

        const results = await Promise.all(
          channelsToUse.map(async ({ id, name }) => {
            try {
              console.log(
                `[API] GET ${cameraHostWithProtocol}/GetSnapshot/${id}`
              );

              const res = await axios.get(
                `${cameraHostWithProtocol}/GetSnapshot/${id}?_=${Date.now()}`,
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
            } catch (err) {
              console.warn(
                `[useCameraSnapshots] snapshot failed for ${name}`,
                err
              );
              return { id, name, image: '' };
            }
          })
        );

        setSnapshots(results);
      } catch (e) {
        console.log('[useCameraSnapshots] fetchSnapshots global error', e);
        // 不中斷 polling，即使全部失敗
      }
    };

    const reloadChannels = async (): Promise<
      { id: string; name: string }[]
    > => {
      try {
        console.log(
          `[API] GET ${cameraHostWithProtocol}/GetChannelList [reloadChannels]`
        );

        const res = await axios.get(
          `${cameraHostWithProtocol}/GetChannelList`,
          {
            headers: { 'Content-Type': 'application/xml', ...AUTH_HEADER },
          }
        );
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
        setChannelList(filtered);
        return filtered;
      } catch (err) {
        console.log('[useCameraSnapshots] reloadChannels failed', err);
        return [];
      }
    };

    fetchSnapshots(); // 第一次立即抓
    intervalRef.current = setInterval(fetchSnapshots, 1000);
    console.log('[useCameraSnapshots] started polling');

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log('[useCameraSnapshots] cleared polling');
      }
    };
  }, [cameraHost, channelList]);

  return { snapshots, channelList, error };
};
