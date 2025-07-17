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
import Ionicons from '@expo/vector-icons/Ionicons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getGamePrice, startGame } from '../api/gameApi';
import { fetchPoolTableByUid } from '../api/poolTableAPI';
import { useDialog } from '../context/DialogContext';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { AppDispatch } from '../store/store';
import { decryptObject } from '../utils/cryptoUtils';
import { getErrorMessage } from '../utils/errorUtils';
import { logJson } from '../utils/logJsonUtils';
import { openDoor } from '../api/userApi';

const { width, height } = Dimensions.get('window');
const SCAN_BOX_SIZE = 250;

const CameraScreen = () => {
  const { openConfirmDialog, openInfoDialog } = useDialog();

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

    setScanned(true);
    try {
      const decryptedObj = decryptObject(data); // 改用 decryptObject 處理 JSON
      if (!decryptedObj || typeof decryptedObj !== 'object') {
        throw new Error('無法解析 QR Code 資料');
      }

      const { qrCodeType, poolTableUid, storeUid } = decryptedObj;

      if (qrCodeType === 1 && poolTableUid) {
        const response = await fetchPoolTableByUid(poolTableUid);
        if (response.success) {
          const storeName = response.data.storeName || '未知店家';
          const tableName = response.data.poolTableName || '未知桌台';
          if (response.data.gameId) {
            dispatch(hideLoading());
            const confirm = await openConfirmDialog({
              title: `已掃描到 ${storeName} - ${tableName}`,
              content: '是否前往付款？',
            });

            if (confirm) {
              dispatch(showLoading());
              const { success, data, message } = await getGamePrice({
                gameId: response.data.gameId,
              });
              dispatch(hideLoading());

              if (success) {
                (navigation as any).navigate('Main', {
                  screen: 'Member',
                  params: {
                    screen: 'Payment',
                    params: {
                      type: 'gameEnd',
                      payData: {
                        gameId: response.data.gameId,
                        poolTableId: response.data.poolTableId,
                      },
                      totalAmount: data.price,
                    },
                  },
                });
              } else {
                await openInfoDialog({
                  title: '錯誤',
                  content: message || '無法載入店家資訊',
                });
              }
            } else {
              setScanned(false);
            }
          } else {
            dispatch(hideLoading());
            const confirm = await openConfirmDialog({
              title: `已掃描到 ${storeName} - ${tableName}`,
              content: '前往開台？',
            });

            if (confirm) {
              try {
                dispatch(showLoading());

                const payType = 'game';
                const result = await startGame({
                  poolTableUId: poolTableUid,
                  payType,
                });
                dispatch(hideLoading());
                if (result.success) {
                  if (result.data) {
                    await openInfoDialog({
                      title: '系統訊息',
                      content: '開局成功',
                      confirmText: '我知道了',
                    });
                    (navigation as any).reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    });
                  } else {
                    await openInfoDialog({
                      title: '錯誤',
                      content: result.message || '開局失敗，請稍後再試',
                    });
                  }
                } else {
                  await openInfoDialog({
                    title: '錯誤',
                    content: result.message || '開局失敗，請稍後再試',
                  });
                }
              } catch (error: any) {
                if (error.isAutoLogout) return;
                await openInfoDialog({
                  title: '錯誤',
                  content: getErrorMessage(error),
                });
              } finally {
              }
            } else {
              setScanned(false);
            }
          }
        } else {
          dispatch(hideLoading());
          const confirm = await openConfirmDialog({
            title: '已掃描到',
            content: '前往開台？',
          });

          if (confirm) {
            (navigation as any).navigate('Main', {
              screen: 'Member',
              params: {
                screen: 'Reservation',
                params: { poolTableUid },
              },
            });
          } else {
            setScanned(false);
          }
        }
      } else if (qrCodeType === 2 && storeUid) {
        dispatch(showLoading());
        const response = await openDoor(storeUid);
        dispatch(hideLoading());

        if (response.success) {
          await openInfoDialog({
            title: '開門成功',
            content: '門已成功開啟！',
          });

          (navigation as any).reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          await openInfoDialog({
            title: '開門失敗',
            content: response.message || '無法開啟門，請稍後再試。',
          });
          setScanned(false);
        }
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
      setScanned(false);
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

      <TouchableOpacity
        style={[styles.closeButton, { zIndex: 10 }]}
        onPress={() => {
          console.log('Close button pressed!');
          (navigation as any).reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }}
      >
        <Ionicons name="close" size={32} color="#fff" />
      </TouchableOpacity>
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
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
});

export default CameraScreen;
