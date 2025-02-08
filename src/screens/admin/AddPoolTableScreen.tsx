import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createPoolTable, updatePoolTable } from '@/api/admin/poolTableApi';
import QRCode from 'react-native-qrcode-svg';
import { encryptData } from '@/utils/cryptoUtils';

// 定義 `route.params` 可能的類型
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
  const isEditMode = !!poolTable; // 只有有傳入 poolTable 時才是編輯模式

  const [tableNumber, setTableNumber] = useState(poolTable?.tableNumber || '');
  const [status, setStatus] = useState(poolTable?.status || 'active');
  const [storeId, setStoreId] = useState(
    poolTable?.store?.id ? String(poolTable.store.id) : ''
  );
  const [isUse, setIsUse] = useState(poolTable?.isUse ?? false);
  const [qrCodeVal, setQrCodeVal] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);

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

  return (
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
        <TextInput
          style={styles.input}
          placeholder="狀態 (active, inactive, maintenance)"
          value={status}
          onChangeText={setStatus}
        />
        <TextInput
          style={styles.input}
          placeholder="店家 ID"
          keyboardType="numeric"
          value={storeId}
          onChangeText={setStoreId}
        />

        <TouchableOpacity
          style={[
            styles.toggleButton,
            isUse ? styles.toggleOn : styles.toggleOff,
          ]}
          onPress={() => setIsUse(!isUse)}
        >
          <Text style={styles.toggleButtonText}>
            {isUse ? '已使用' : '未使用'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
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
              <QRCode value={qrCodeVal} size={200} />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
});

export default AddPoolTableScreen;
