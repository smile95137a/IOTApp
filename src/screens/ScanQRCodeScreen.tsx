import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { scanQRCodes } from 'vision-camera-code-scanner';
import 'react-native-reanimated';

const ScanQRCodeScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;

  const [hasPermission, setHasPermission] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    };

    requestCameraPermission();
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const qrCodes = scanQRCodes(frame);
    if (qrCodes.length > 0) {
      console.log('QR Codes found:', qrCodes);
      runOnJS(setQrCode)(qrCodes[0].content); // 傳遞掃描到的內容到主線程
    }
  }, []);

  if (!device) return <Text>正在加載相機...</Text>;
  if (!hasPermission) return <Text>沒有相機權限</Text>;

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      {qrCode && (
        <View style={styles.qrCodeResult}>
          <Text>掃描結果: {qrCode}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  qrCodeResult: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
});

export default ScanQRCodeScreen;
