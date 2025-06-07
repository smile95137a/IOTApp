import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { XMLParser } from 'fast-xml-parser';

const CAMERA_HOST = 'http://192.168.1.107';
const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

const DeviceSnapshotScreen = () => {
  const [channels, setChannels] = useState<{ id: string; name: string }[]>([]);
  const [snapshots, setSnapshots] = useState<
    { id: string; name: string; image: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchChannelList = async () => {
    try {
      const response = await axios.get(`${CAMERA_HOST}/GetChannelList`, {
        headers: {
          'Content-Type': 'application/xml',
          ...AUTH_HEADER,
        },
      });

      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      });

      const parsed = parser.parse(response.data);
      const items = parsed?.config?.item;

      const result: { id: string; name: string }[] = [];

      if (Array.isArray(items)) {
        items.forEach((ch) => {
          if (ch['@_channelStatus'] === 'videoOn') {
            result.push({
              id: ch['#text'] || '',
              name: ch['@_name'] || `Camera ${ch['#text']}`,
            });
          }
        });
      } else if (
        typeof items === 'object' &&
        items['@_channelStatus'] === 'videoOn'
      ) {
        result.push({
          id: items['#text'] || '',
          name: items['@_name'] || `Camera ${items['#text']}`,
        });
      }

      setChannels(result);
    } catch (err: any) {
      setError('通道列表錯誤：' + err.message);
    }
  };

  const fetchSnapshots = async (
    channelList: { id: string; name: string }[]
  ) => {
    const promises = channelList.map(async ({ id, name }) => {
      try {
        const response = await axios.get(
          `${CAMERA_HOST}/GetSnapshot/${id}?_=${Date.now()}`,
          {
            headers: {
              ...AUTH_HEADER,
            },
            responseType: 'blob',
          }
        );

        const reader = new FileReader();
        return await new Promise<{ id: string; name: string; image: string }>(
          (resolve, reject) => {
            reader.onloadend = () => {
              resolve({ id, name, image: reader.result as string });
            };
            reader.onerror = reject;
            reader.readAsDataURL(response.data);
          }
        );
      } catch {
        return { id, name, image: '' };
      }
    });

    const results = await Promise.all(promises);
    setSnapshots(results);
  };

  useEffect(() => {
    fetchChannelList();
  }, []);

  useEffect(() => {
    if (channels.length === 0) return;

    fetchSnapshots(channels); // 立即執行一次

    intervalRef.current = setInterval(() => {
      fetchSnapshots(channels);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [channels]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : snapshots.length === 0 ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <>
          <Text style={styles.title}>
            目前有訊號的攝影機：{channels.length} 台
          </Text>
          {snapshots.map((snap) => (
            <View key={snap.id} style={styles.card}>
              <Text style={styles.name}>
                {snap.name}（通道 {snap.id}）
              </Text>
              {snap.image ? (
                <Image source={{ uri: snap.image }} style={styles.image} />
              ) : (
                <Text style={styles.error}>影像載入失敗</Text>
              )}
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { marginBottom: 24, alignItems: 'center' },
  name: { fontSize: 16, marginBottom: 8 },
  image: { width: 320, height: 240, borderRadius: 8, backgroundColor: '#ccc' },
  error: { color: 'red', fontSize: 16 },
});

export default DeviceSnapshotScreen;
