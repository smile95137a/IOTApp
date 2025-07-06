import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

export const useAutoReplay = (
  cameraHost: string,
  channelId: number,
  date: string,
  enabled: boolean
) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !date) return;

    let sec = 0;
    const host = cameraHost.startsWith('http')
      ? cameraHost
      : `http://${cameraHost}`;

    const loop = async () => {
      const timeStr = `${date} ${String(Math.floor(sec / 3600)).padStart(
        2,
        '0'
      )}:${String(Math.floor((sec % 3600) / 60)).padStart(2, '0')}:${String(
        sec % 60
      ).padStart(2, '0')}`;

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <config version="1.0" xmlns="http://www.ipc.com/ver10">
          <search>
            <time type="string"><![CDATA[${timeStr}]]></time>
            <length type="uint16">10</length>
          </search>
        </config>`;

      try {
        const res = await axios.post(
          `${host}/GetSnapshotByTime/${channelId}`,
          xml,
          {
            headers: {
              ...AUTH_HEADER,
              'Content-Type': 'application/xml',
            },
            responseType: 'blob',
          }
        );
        const url = URL.createObjectURL(res.data);
        setImageUrl(url);
      } catch {
        setImageUrl(null);
      }

      sec += 10;
      timerRef.current = setTimeout(loop, 5000);
    };

    loop();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [cameraHost, channelId, date, enabled]);

  return imageUrl;
};
