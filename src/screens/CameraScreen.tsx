import React, { useState, useEffect, useRef } from 'react';
import { View, Alert, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { closeCamera } from '@/store/cameraSlice';
import { RootState } from '@/store/store';
import { decryptData } from '@/utils/cryptoUtils';
import { useNavigation } from '@react-navigation/native';
import { fetchPoolTableByUid } from '@/api/poolTableAPI';

const CameraScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
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

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scannedRef.current) return; // 已掃描過則直接返回，避免重複觸發
    scannedRef.current = true;

    try {
      const tableUid = decryptData(data);
      const response = await fetchPoolTableByUid(tableUid);

      if (response.success) {
        Alert.alert('已掃描到', '前往開台', [
          {
            text: '確定',
            onPress: () => {
              dispatch(closeCamera());
              setTimeout(() => {
                navigation.navigate('Member', {
                  screen: 'Reservation',
                  params: { tableUid }, // 傳遞桌檯 UID
                });
                setTimeout(() => {
                  scannedRef.current = false; // 重設 `scanned` 狀態
                }, 500);
              }, 300);
            },
          },
        ]);
      } else {
        Alert.alert('錯誤', response.message || '無法獲取桌檯資訊', [
          {
            text: '確定',
            onPress: () => {
              handleClose();
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('錯誤', '發生錯誤，請重試', [
        {
          text: '確定',
          onPress: () => {
            handleClose();
          },
        },
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

  const handleClose = () => {
    dispatch(closeCamera());
    navigation.goBack();
    setTimeout(() => {
      scannedRef.current = false; // 重設 `scanned` 狀態
    }, 300);
  };

  return (
    <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarCodeScanned} // 直接使用函數，避免 undefined 導致不觸發掃描
      />
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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
