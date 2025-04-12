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
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createPoolTable, updatePoolTable } from '@/api/admin/poolTableApi';
import QRCode from 'react-native-qrcode-svg';
import { encryptData } from '@/utils/cryptoUtils';
import { fetchAllStores } from '@/api/admin/storeApi';
import { Picker } from '@react-native-picker/picker';
import HeaderBar from '@/component/admin/HeaderBar';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
  useEffect(() => {
    const loadStores = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllStores();
        dispatch(hideLoading());

        if (response.success) {
          setStores(response.data); // 存入店家列表
        } else {
          Alert.alert('錯誤', '無法獲取店家列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        Alert.alert('錯誤', '獲取店家失敗，請稍後再試');
      }
    };

    loadStores();
  }, []);

  const handleSubmit = async () => {
    if (!tableNumber.trim() || !status.trim() || !storeId.trim()) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
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
          Alert.alert('成功', '桌檯資訊更新成功', [
            { text: '確定', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('錯誤', message || '更新失敗');
        }
      } else {
        const { success, message } = await createPoolTable(poolTableData);
        dispatch(hideLoading());

        if (success) {
          Alert.alert('成功', '桌檯新增成功', [
            { text: '確定', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('錯誤', message || '新增失敗');
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };
  const genQrcode = () => {
    if (!isEditMode) return;
    console.log(poolTable.uid);

    setQrCodeVal(encryptData(`${poolTable.uid}`));
    setShowQRCode(true);
  };

  const qrCodeRef = React.useRef<QRCode>(null);

  const handleSaveQRCode = async () => {
    try {
      if (!qrCodeRef.current) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('權限不足', '需要媒體存取權限才能儲存圖片');
        return;
      }

      qrCodeRef.current.toDataURL(async (data) => {
        const base64Code = `data:image/png;base64,${data}`;
        const fileUri = FileSystem.cacheDirectory + `qrcode_${Date.now()}.png`;

        await FileSystem.writeAsStringAsync(fileUri, data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync('QRCode', asset, false);

        Alert.alert('成功', '已儲存 QR Code 至相簿');
      });
    } catch (error) {
      console.error('儲存失敗', error);
      Alert.alert('錯誤', '儲存 QR Code 時發生錯誤');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar title={isEditMode ? '編輯桌檯' : '新增桌檯'} />
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
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="可用" value="AVAILABLE" />
                  <Picker.Item label="不可用" value="UNAVAILABLE" />
                </Picker>

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
                      <QRCode
                        value={qrCodeVal}
                        size={200}
                        getRef={(c) => (qrCodeRef.current = c)}
                        quietZone={20}
                      />

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
});

export default AddPoolTableScreen;
