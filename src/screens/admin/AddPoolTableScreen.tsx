// beautified AddPoolTableScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
import { fetchRoutersByStoreId } from '../../api/admin/routerApi';
import { encryptObject } from '../../utils/cryptoUtils';
import { MyDropdown } from '../../component/MyDropdown';
import { logJson } from '../../utils/logJsonUtils';

const COLORS = {
  primary: '#007bff',
  secondary: '#ffc107',
  danger: '#dc3545',
  success: '#28a745',
  background: '#f8f9fa',
  border: '#dee2e6',
};

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

type PoolTableParams = {
  poolTable?: {
    uid: string;
    tableNumber: string;
    status: string;
    store: { id: number };
    isUse: boolean;
    routerIds?: number[];
  };
  storeId?: number;
};

const AddPoolTableScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: PoolTableParams }, 'params'>>();
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog, openConfirmDialog } = useDialog();

  const poolTable = route.params?.poolTable;
  const choseStoreId = route.params?.storeId;
  const isEditMode = !!poolTable;

  const [tableNumber, setTableNumber] = useState(poolTable?.tableNumber || '');
  const [status, setStatus] = useState(poolTable?.status || 'AVAILABLE');
  const [storeId, setStoreId] = useState(
    poolTable?.store?.id ? String(poolTable.store.id) : `${choseStoreId}`
  );
  const [isUse, setIsUse] = useState(poolTable?.isUse ?? false);
  const [qrCodeVal, setQrCodeVal] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [routerIds, setRouterIds] = useState<number[]>(
    poolTable?.routerIds || []
  );
  const [routers, setRouters] = useState<{ id: number; circuitName: string }[]>(
    []
  );
  logJson('asd', poolTable);
  const qrCodeRef = useRef<any>(null);

  useEffect(() => {
    const loadRouters = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchRoutersByStoreId(
          ~~storeId
        );
        dispatch(hideLoading());
        if (success) setRouters(data);
        else openInfoDialog({ title: '錯誤', content: message || '查詢失敗' });
      } catch {
        dispatch(hideLoading());
        openInfoDialog({ title: '錯誤', content: '發生例外錯誤，請稍後再試' });
      }
    };
    loadRouters();
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
    const payload = {
      tableNumber,
      status,
      store: { id: parseInt(storeId) },
      isUse,
      routerIds,
    };
    try {
      dispatch(showLoading());
      const result = isEditMode
        ? await updatePoolTable(poolTable.uid, payload)
        : await createPoolTable(payload);
      dispatch(hideLoading());
      await openInfoDialog({
        title: result.success ? '成功' : '錯誤',
        content: result.message || (isEditMode ? '更新失敗' : '新增失敗'),
        confirmText: '我知道了',
      });
      if (result.success) (navigation as any).goBack();
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({ title: '錯誤', content: getErrorMessage(error) });
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <HeaderBar
            showLeftButton
            title={isEditMode ? '編輯桌檯' : '新增桌檯'}
          />
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
                  onChange={setStatus}
                  items={[
                    { label: '啟用', value: 'AVAILABLE' },
                    { label: '停用', value: 'UNAVAILABLE' },
                    { label: '故障', value: 'FAULT' },
                  ]}
                  zIndex={3000}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>選擇 Router：</Text>
                {routers.map((router) => {
                  const selected = routerIds.includes(router.id);
                  return (
                    <TouchableOpacity
                      key={router.id}
                      style={styles.routerItem}
                      onPress={() => {
                        setRouterIds((prev) =>
                          selected
                            ? prev.filter((id) => id !== router.id)
                            : [...prev, router.id]
                        );
                      }}
                    >
                      <View
                        style={[
                          styles.routerCheckbox,
                          selected && styles.routerCheckboxSelected,
                        ]}
                      />
                      <Text style={{ fontSize: 16 }}>{router.circuitName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {isEditMode ? '更新' : '提交'}
                </Text>
              </TouchableOpacity>

              {isEditMode && (
                <TouchableOpacity style={styles.qrButton} onPress={genQrcode}>
                  <Text style={styles.qrButtonText}>產生 QR Code</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContainer: { padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    ...SHADOW,
  },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 8 },
  routerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routerCheckbox: {
    height: 22,
    width: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
    marginRight: 12,
  },
  routerCheckboxSelected: {
    backgroundColor: COLORS.primary,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    ...SHADOW,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  qrButton: {
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    ...SHADOW,
  },
  qrButtonText: { color: '#000', fontSize: 18, fontWeight: '600' },
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
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default AddPoolTableScreen;
