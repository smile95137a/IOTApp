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
  Switch,
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
  const [equipments, setEquipments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [equipmentName, setEquipmentName] = useState('');
  const [autoStartTime, setAutoStartTime] = useState('');
  const [autoStopTime, setAutoStopTime] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [editingEquipmentIndex, setEditingEquipmentIndex] = useState(null);

  const [tableNumber, setTableNumber] = useState(poolTable?.tableNumber || '');
  const [status, setStatus] = useState(poolTable?.status || 'active');
  const [storeId, setStoreId] = useState(
    poolTable?.storeId ? String(poolTable.storeId) : ''
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
      equipments: equipments.map((equipment) => ({
        name: equipment.name,
        autoStartTime: equipment.autoStartTime,
        autoStopTime: equipment.autoStopTime,
        description: equipment.description || '',
        enabled: equipment.enabled,
      })),
    };
    console.log(poolTableData);
    // try {
    //   dispatch(showLoading());

    //   if (isEditMode) {
    //     const { success, message } = await updatePoolTable(
    //       poolTable.uid,
    //       poolTableData
    //     );
    //     dispatch(hideLoading());

    //     if (success) {
    //       Alert.alert('成功', '桌檯資訊更新成功', [
    //         { text: '確定', onPress: () => navigation.goBack() },
    //       ]);
    //     } else {
    //       Alert.alert('錯誤', message || '更新失敗');
    //     }
    //   } else {
    //     console.log('))))))))))(((((((', poolTableData);

    //     const { success, message } = await createPoolTable(poolTableData);
    //     dispatch(hideLoading());

    //     if (success) {
    //       Alert.alert('成功', '桌檯新增成功', [
    //         { text: '確定', onPress: () => navigation.goBack() },
    //       ]);
    //     } else {
    //       Alert.alert('錯誤', message || '新增失敗');
    //     }
    //   }
    // } catch (error) {
    //   dispatch(hideLoading());
    //   Alert.alert('錯誤', '發生錯誤，請稍後再試');
    // }
  };
  const genQrcode = () => {
    if (!isEditMode) return;
    console.log(poolTable.uid);

    setQrCodeVal(encryptData(`${poolTable.uid}`));
    setShowQRCode(true);
  };

  const handleEditEquipment = (index) => {
    const equipment = equipments[index];
    setEquipmentName(equipment.name);
    setAutoStartTime(equipment.autoStartTime);
    setAutoStopTime(equipment.autoStopTime);
    setEquipmentDescription(equipment.description);
    setEditingEquipmentIndex(index);
    setModalVisible(true);
  };

  const handleDeleteEquipment = (index) => {
    Alert.alert('確認刪除', '確定要刪除此設備嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: () => {
          const updatedEquipments = equipments.filter((_, i) => i !== index);
          setEquipments(updatedEquipments);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddOrUpdateEquipment = () => {
    if (
      !equipmentName.trim() ||
      !autoStartTime.trim() ||
      !autoStopTime.trim()
    ) {
      Alert.alert('錯誤', '請填寫完整設備資訊');
      return;
    }

    const newEquipment = {
      name: equipmentName,
      autoStartTime,
      autoStopTime,
      description: equipmentDescription || '',
      enabled: true,
    };

    if (editingEquipmentIndex !== null) {
      // 編輯模式
      const updatedEquipments = [...equipments];
      updatedEquipments[editingEquipmentIndex] = newEquipment;
      setEquipments(updatedEquipments);
    } else {
      // 新增模式
      setEquipments([...equipments, newEquipment]);
    }

    // 清空欄位 & 關閉 Modal
    setEquipmentName('');
    setAutoStartTime('');
    setAutoStopTime('');
    setEquipmentDescription('');
    setEditingEquipmentIndex(null);
    setModalVisible(false);
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
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="可用" value="AVAILABLE" />
          <Picker.Item label="不可用" value="UNAVAILABLE" />
        </Picker>
        {/* 店家選擇 Picker */}
        <Text style={styles.label}>選擇店家</Text>
        <Picker
          selectedValue={storeId}
          onValueChange={(itemValue) => setStoreId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="請選擇店家" value="" />
          {stores.map((store) => (
            <Picker.Item
              key={store.id}
              label={store.name}
              value={String(store.id)}
            />
          ))}
        </Picker>

        {/* Modal 彈窗 */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>新增設備</Text>
              <Text style={styles.modalLabel}>設備名稱</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="設備名稱"
                value={equipmentName}
                onChangeText={setEquipmentName}
              />
              <Text style={styles.modalLabel}>自動開始時間</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="自動開始時間 (HH:mm)"
                value={autoStartTime}
                onChangeText={setAutoStartTime}
              />
              <Text style={styles.modalLabel}>自動結束時間</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="自動結束時間 (HH:mm)"
                value={autoStopTime}
                onChangeText={setAutoStopTime}
              />
              <Text style={styles.modalLabel}>設備描述</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="設備描述 (可選)"
                value={equipmentDescription}
                onChangeText={setEquipmentDescription}
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>取消</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleAddOrUpdateEquipment}
                >
                  <Text style={styles.confirmButtonText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>新增設備</Text>
        </TouchableOpacity>

        {/* 顯示設備列表 */}
        {equipments.map((equipment, index) => (
          <View key={index} style={styles.equipmentItem}>
            <TouchableOpacity onPress={() => handleEditEquipment(index)}>
              <Text style={styles.equipmentText}>
                {equipment.name} ({equipment.autoStartTime} -{' '}
                {equipment.autoStopTime})
              </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row' }}>
              <Switch
                value={equipment.enabled}
                onValueChange={(newValue) => {
                  const updatedEquipments = [...equipments];
                  updatedEquipments[index].enabled = newValue;
                  setEquipments(updatedEquipments);
                }}
              />
              <TouchableOpacity onPress={() => handleDeleteEquipment(index)}>
                <Text style={styles.deleteButtonText}>刪除</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

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
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },

  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  equipmentInputContainer: { marginBottom: 20 },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 16 },
  equipmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  equipmentText: { fontSize: 16 },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },

  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddPoolTableScreen;
