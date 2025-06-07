// hooks/useCameraSnapshots.ts
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import { XMLParser } from 'fast-xml-parser';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

export const useCameraSnapshots = (cameraHost: string) => {
  const [snapshots, setSnapshots] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchChannelList = async () => {
    try {
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

      return list
        .filter((ch) => ch['@_channelStatus'] === 'videoOn')
        .map((ch) => ({
          id: ch['#text'],
          name: ch['@_name'] || `Camera ${ch['#text']}`,
        }));
    } catch (err: any) {
      setError('取得通道錯誤：' + err.message);
      return [];
    }
  };

  const fetchSnapshots = async (channels: { id: string; name: string }[]) => {
    const results = await Promise.all(
      channels.map(async ({ id, name }) => {
        try {
          const res = await axios.get(
            `${cameraHost}/GetSnapshot/${id}?_=${Date.now()}`,
            {
              headers: AUTH_HEADER,
              responseType: 'blob',
            }
          );

          const reader = new FileReader();
          return await new Promise<{ id: string; name: string; image: string }>(
            (resolve, reject) => {
              reader.onloadend = () =>
                resolve({ id, name, image: reader.result as string });
              reader.onerror = reject;
              reader.readAsDataURL(res.data);
            }
          );
        } catch {
          return { id, name, image: '' };
        }
      })
    );

    setSnapshots(results);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      const channels = await fetchChannelList();
      if (!active || channels.length === 0) return;

      await fetchSnapshots(channels);
      intervalRef.current = setInterval(() => fetchSnapshots(channels), 100);
    })();

    return () => {
      active = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [cameraHost]);

  return { snapshots, error };
};
