import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { closeCamera } from '@/store/cameraSlice';
import { RootState } from '@/store/store';
import { decryptData } from '@/utils/cryptoUtils';

const CameraScreen = () => {
  const dispatch = useDispatch();
  const isCameraOpen = useSelector(
    (state: RootState) => state.camera.isCameraOpen
  );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannedRef = useRef(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (!scannedRef.current) {
      scannedRef.current = true;
      const tableUid = decryptData(data);
      Alert.alert('QR Code Scanned', `桌檯的uid: ${decryptData(data)}`, [
        { text: 'OK', onPress: () => (scannedRef.current = false) },
      ]);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    Alert.alert('錯誤', '未授予相機權限');
    return <View />;
  }

  return (
    <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned} // 直接使用函數，避免 undefined 導致不觸發掃描
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          scannedRef.current = false; // 關閉相機時重設 `scanned` 狀態
          dispatch(closeCamera());
        }}
      >
        <Icon name="close" size={30} color="#fff" />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
});

export default CameraScreen;
