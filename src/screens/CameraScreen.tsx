import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { fetchPoolTableByUid } from '@/api/poolTableAPI';
import { decryptData } from '@/utils/cryptoUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getGamePrice } from '@/api/gameApi';
import { logJson } from '@/utils/logJsonUtils';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { showLoading, hideLoading } from '@/store/loadingSlice';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_SIZE = 250;

const CameraScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (permission === null || permission?.granted) return;
    requestPermission();
  }, [permission]);

  useEffect(() => {
    animateScanLine();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
    }, [])
  );

  const animateScanLine = () => {
    scanAnim.setValue(0);
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  };

  const handleBarCodeScanned = async ({
    type,
    data,
    bounds,
  }: {
    type: string;
    data: string;
    bounds?: { origin: { x: number; y: number } };
  }) => {
    if (scanned) return;

    const scanBoxX = (width - SCAN_BOX_SIZE) / 2;
    const scanBoxY = (height - SCAN_BOX_SIZE) / 2;

    if (bounds?.origin) {
      const { x, y } = bounds.origin;
      const isInScanBox =
        x >= scanBoxX &&
        x <= scanBoxX + SCAN_BOX_SIZE &&
        y >= scanBoxY &&
        y <= scanBoxY + SCAN_BOX_SIZE;

      if (!isInScanBox) return;
    }

    setScanned(true);
    try {
      const tableUid = decryptData(data);
      logJson('asdasdasd', tableUid);

      const response = await fetchPoolTableByUid(tableUid);
      if (response.success) {
        if (response.data.gameId) {
          Alert.alert('已掃描到', '是否前往付款', [
            {
              text: '確定',
              onPress: async () => {
                dispatch(showLoading());
                const { success, data, message } = await getGamePrice({
                  gameId: response.data.gameId,
                });
                dispatch(hideLoading());
                if (success) {
                  (navigation as any).navigate('Member', {
                    screen: 'Payment',
                    params: {
                      type: 'gameEnd',
                      payData: {
                        gameId: response.data.gameId,
                        poolTableId: response.data.poolTableId,
                      },
                      totalAmount: data.price,
                    },
                  });
                } else {
                  Alert.alert('錯誤', message || '無法載入店家資訊');
                }
              },
            },
          ]);
        } else {
          Alert.alert('已掃描到', '前往開台', [
            {
              text: '確定',
              onPress: () => {
                (navigation as any).navigate('Member', {
                  screen: 'Reservation',
                  params: { tableUid },
                });
              },
            },
          ]);
        }
      } else {
        Alert.alert('已掃描到', '前往開台', [
          {
            text: '確定',
            onPress: () => {
              (navigation as any).navigate('Member', {
                screen: 'Reservation',
                params: { tableUid },
              });
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert('錯誤', '發生錯誤，請重試', [
        {
          text: '確定',
          onPress: () => {
            setScanned(false);
          },
        },
      ]);
    }
  };

  if (!permission) {
    return <Text>正在請求相機權限...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>需要相機權限才能掃描 QR 碼</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>允許相機權限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const scanLineTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCAN_BOX_SIZE - 2],
  });

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      <View style={styles.overlay}>
        <View
          style={{
            height: (height - SCAN_BOX_SIZE) / 2,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanBox}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateY: scanLineTranslateY }],
                },
              ]}
            />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            paddingTop: 20,
          }}
        >
          <Text style={styles.tipText}>請將 QR 碼置於框內自動掃描</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  middleRow: {
    flexDirection: 'row',
    height: SCAN_BOX_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanBox: {
    width: SCAN_BOX_SIZE,
    height: SCAN_BOX_SIZE,
    position: 'relative',
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    overflow: 'hidden',
  },
  corner: {
    width: 20,
    height: 20,
    borderColor: '#00FFAA',
    position: 'absolute',
  },
  topLeft: {
    borderTopWidth: 4,
    borderLeftWidth: 4,
    top: 0,
    left: 0,
  },
  topRight: {
    borderTopWidth: 4,
    borderRightWidth: 4,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    borderBottomWidth: 4,
    borderRightWidth: 4,
    bottom: 0,
    right: 0,
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#00FFAA',
    position: 'absolute',
    top: 0,
  },
  tipText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 8,
  },
});

export default CameraScreen;
