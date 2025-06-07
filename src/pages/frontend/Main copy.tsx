import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LiveSnapshotViewer: React.FC = () => {
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const fetchSnapshot = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/GetSnapshot',
        {
          responseType: 'blob', // 取得圖片 blob
        }
      );

      const imageUrl = URL.createObjectURL(response.data);
      setSnapshotUrl(imageUrl);
    } catch (error) {
      console.error('🚨 取得即時影像失敗:', error);
    }
  };

  useEffect(() => {
    fetchSnapshot(); // 初次載入
    const interval = setInterval(fetchSnapshot, 1000); // 每 1 秒更新

    return () => clearInterval(interval); // 卸載時清除
  }, []);

  return (
    <div>
      {snapshotUrl ? (
        <img
          src={snapshotUrl}
          alt="Live Snapshot"
          style={{ width: '100%', maxWidth: 640 }}
        />
      ) : (
        <p>載入中...</p>
      )}
    </div>
  );
};

export default LiveSnapshotViewer;
