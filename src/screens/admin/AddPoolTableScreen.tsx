import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import { updatePoolTable, createPoolTable } from '../../api/admin/poolTableApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { fetchAllStores } from '../../api/admin/storeApi';
import { encryptObject } from '../../utils/cryptoUtils';
type PoolTableParams = {
  poolTable?: {
    uid: string;
    tableNumber: string;
    status: string;
    store: { id: number };
    isUse: boolean;
  };
};

const AddPoolTableScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: PoolTableParams }, 'params'>>();
  const dispatch = useDispatch<AppDispatch>();

  const poolTable = route.params?.poolTable;
  const choseStoreId = route.params?.storeId;

  const isEditMode = !!poolTable;

  const [tableNumber, setTableNumber] = useState(poolTable?.tableNumber || '');
  const [status, setStatus] = useState(poolTable?.status || 'active');
  const [storeId, setStoreId] = useState(
    poolTable?.storeId ? String(poolTable.storeId) : `${choseStoreId}`
  );
  const [isUse, setIsUse] = useState(poolTable?.isUse ?? false);
  const [qrCodeVal, setQrCodeVal] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [stores, setStores] = useState([]);
  const { openInfoDialog, openConfirmDialog } = useDialog();

  useEffect(() => {
    const loadStores = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllStores();
        dispatch(hideLoading());

        if (response.success) {
          setStores(response.data);
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: '無法獲取店家列表',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadStores();
  }, []);

  const handleSubmit = async () => {
    if (!tableNumber.trim() || !status.trim() || !storeId.trim()) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫完整資訊',
        confirmText: '我知道了',
      });
      return;
    }

    if (status === 'FAULT') {
      const confirmed = await openConfirmDialog({
        title: '提醒',
        content: '若狀態為故障，所有預約單將被取消，確定要繼續嗎？',
        confirmText: '確定',
        cancelText: '取消',
      });

      if (!confirmed) return;
    }
    const poolTableData = {
      tableNumber,
      status,
      store: { id: parseInt(storeId) },
      isUse,
    };

    try {
      dispatch(showLoading());

      if (isEditMode) {
        const { success, message } = await updatePoolTable(
          poolTable.uid,
          poolTableData
        );
        dispatch(hideLoading());

        if (success) {
          await openInfoDialog({
            title: '成功',
            content: '桌檯資訊更新成功',
            confirmText: '確定',
          });
          (navigation as any).goBack();
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: message || '更新失敗',
            confirmText: '我知道了',
          });
        }
      } else {
        const { success, message } = await createPoolTable(poolTableData);
        dispatch(hideLoading());

        if (success) {
          await openInfoDialog({
            title: '成功',
            content: '桌檯新增成功',
            confirmText: '確定',
          });
          (navigation as any).goBack();
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: message || '新增失敗',
            confirmText: '我知道了',
          });
        }
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };
  const genQrcode = () => {
    if (!isEditMode) return;
    const encrypted = encryptObject({
      qrCodeType: 1,
      poolTableUid: poolTable.uid,
    });
    setQrCodeVal(encrypted);
    setShowQRCode(true);
  };

  const qrCodeRef = React.useRef<any>(null);

  const handleSaveQRCode = async () => {
    try {
      dispatch(showLoading());
      const uri = await qrCodeRef.current.capture();
      dispatch(hideLoading());
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        await openInfoDialog({
          title: '權限不足',
          content: '需要媒體存取權限才能儲存圖片',
          confirmText: '我知道了',
        });
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('QRCode', asset, false);
      setShowQRCode(false);
      await openInfoDialog({
        title: '成功',
        content: '已儲存 QR Code 至相簿',
        confirmText: '我知道了',
      });
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: '儲存 QR Code 時發生錯誤',
        confirmText: '我知道了',
      });
    }
  };
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('../../assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar
              showLeftButton
              title={isEditMode ? '編輯桌檯' : '新增桌檯'}
            />
          </View>
          <View style={styles.contentWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
            >
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>
                  {isEditMode ? '編輯桌檯' : '新增桌檯'}
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="桌檯號碼"
                  value={tableNumber}
                  onChangeText={setTableNumber}
                />

                <View style={styles.formGroup}>
                  <MyDropdown
                    value={status}
                    onChange={handleStatusChange}
                    items={[
                      { label: '啟用', value: 'AVAILABLE' },
                      { label: '停用', value: 'UNAVAILABLE' },
                      { label: '故障', value: 'FAULT' },
                    ]}
                    zIndex={3000}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? '更新' : '提交'}
                  </Text>
                </TouchableOpacity>

                {/* 只有在編輯模式下才顯示 QR Code 按鈕 */}
                {isEditMode && (
                  <TouchableOpacity style={styles.qrButton} onPress={genQrcode}>
                    <Text style={styles.qrButtonText}>產生 QR Code</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>

              {/* QR Code Modal */}
              {isEditMode && (
                <Modal visible={showQRCode} transparent animationType="slide">
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>桌檯 QR Code</Text>
                      <ViewShot
                        ref={qrCodeRef}
                        options={{ format: 'png', result: 'tmpfile' }}
                      >
                        <QRCode value={qrCodeVal} size={200} quietZone={20} />
                      </ViewShot>

                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={handleSaveQRCode}
                      >
                        <Text style={styles.closeButtonText}>儲存 QR Code</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowQRCode(false)}
                      >
                        <Text style={styles.closeButtonText}>關閉</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </KeyboardAvoidingView>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },

  headerWrapper: { backgroundColor: '#FFFFFF' },
  contentWrapper: { flex: 1, padding: 20 },
  scrollContainer: { padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  toggleButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  toggleOn: { backgroundColor: '#28a745' },
  toggleOff: { backgroundColor: '#dc3545' },
  toggleButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  qrButton: {
    backgroundColor: '#ffc107',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  qrButtonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },

  // QR Code Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },

  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
  formGroup: {
    marginBottom: 32,
  },
});

export default AddPoolTableScreen;
