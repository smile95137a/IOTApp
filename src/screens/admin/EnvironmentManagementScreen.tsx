import {
  createStoreEquipment,
  deleteStoreEquipment,
  fetchStoreEquipmentsByStoreId,
  updateStoreEquipment,
  updateStoreEquipmentStatus,
} from '@/api/admin/equipmentApi';
import { fetchAllVendors } from '@/api/admin/vendorApi';
import Header from '@/component/Header';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

const EnvironmentManagementScreen = ({ navigation }) => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();

  const [equipments, setEquipments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [equipmentId, setEquipmentId] = useState(null);
  const [equipmentName, setEquipmentName] = useState('');
  const [autoStartTime, setAutoStartTime] = useState('');
  const [autoStopTime, setAutoStopTime] = useState('');
  const [equipmentDescription, setEquipmentDescription] = useState('');
  const [equipmentEnabled, setEquipmentEnabled] = useState(false);
  const [editingEquipmentIndex, setEditingEquipmentIndex] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const showModal = () => {
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleEditEquipment = (index) => {
    const equipment = equipments[index];
    setEquipmentId(equipment.id);
    setEquipmentName(equipment.name);
    setAutoStartTime(equipment.autoStartTime);
    setAutoStopTime(equipment.autoStopTime);
    setEquipmentDescription(equipment.description);
    setEquipmentEnabled(equipment.enabled);
    setEditingEquipmentIndex(index);
    showModal();
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

  const handleAddOrUpdateEquipment = async () => {
    if (
      !equipmentName.trim() ||
      !autoStartTime.trim() ||
      !autoStopTime.trim()
    ) {
      Alert.alert('錯誤', '請填寫完整設備資訊');
      return;
    }

    try {
      dispatch(showLoading());
      let response;
      if (equipmentId === null) {
        const newEquipment = {
          id: equipmentId,
          name: equipmentName,
          autoStartTime,
          autoStopTime,
          description: equipmentDescription || '',
        };
        response = await createStoreEquipment({
          name: newEquipment.name,
          autoStartTime: newEquipment.autoStartTime,
          autoStopTime: newEquipment.autoStopTime,
          description: newEquipment.description || '',
          store: { id: storeId },
        });
      } else {
        const editEquipment = {
          name: equipmentName,
          autoStartTime,
          autoStopTime,
          description: equipmentDescription || '',
        };
        response = await updateStoreEquipment(equipmentId, {
          name: editEquipment.name,
          autoStartTime: editEquipment.autoStartTime,
          autoStopTime: editEquipment.autoStopTime,
          description: editEquipment.description || '',
          store: { id: storeId },
        });
      }

      dispatch(hideLoading());
      if (response.success) {
        loadVendors();
      } else {
        Alert.alert('錯誤', '無法獲取供應商列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }

    // 清空欄位 & 關閉 Modal
    setEquipmentId(null);
    setEquipmentName('');
    setAutoStartTime('');
    setAutoStopTime('');
    setEquipmentDescription('');
    setEditingEquipmentIndex(null);
    setModalVisible(false);
  };

  const loadVendors = async () => {
    try {
      dispatch(showLoading());
      const response = await fetchStoreEquipmentsByStoreId(storeId);
      dispatch(hideLoading());

      if (response.success) {
        const formattedData = response.data.map((item) => ({
          id: item.id,
          name: item.equipmentName,
          autoStartTime: item.autoStartTime,
          autoStopTime: item.autoStopTime,
          description: item.description || '',
          enabled: !!item.status,
        }));
        console.log('OOOOOOOO', formattedData);

        setEquipments(formattedData);
      } else {
        Alert.alert('錯誤', '無法獲取供應商列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '獲取供應商失敗');
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const toggleSwitch = async (index) => {
    const selectedEquipment = equipments[index];
    const equipmentId = selectedEquipment.id;
    const newStatus = !selectedEquipment.enabled;
    const updatedEquipments = [...equipments];
    updatedEquipments[index].enabled = newStatus;
    setEquipments(updatedEquipments);

    try {
      dispatch(showLoading());
      await updateStoreEquipmentStatus(equipmentId, newStatus);
      dispatch(hideLoading());
      loadVendors();
      console.log('設備狀態更新成功！');
    } catch (error) {
      console.error('更新設備狀態失敗:', error);
      updatedEquipments[index].enabled = !newStatus;
      setEquipments([...updatedEquipments]);
      Alert.alert('錯誤', '無法更新設備狀態，請稍後再試');
    }
  };
  const handleDelEquipment = async (index) => {
    const equipment = equipments[index];

    Alert.alert('確認刪除', `確定要刪除設備「${equipment.name}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: async () => {
          try {
            dispatch(showLoading());
            await deleteStoreEquipment(equipment.id); // 可能需要 API 來刪除設備
            dispatch(hideLoading());

            loadVendors();
            Alert.alert('成功', '設備已刪除');
          } catch (error) {
            dispatch(hideLoading());
            Alert.alert('錯誤', '刪除設備失敗，請稍後再試');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-admin-bg.png')}
            resizeMode="contain"
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header title="環境管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {equipments.map((light, index) => (
            <View key={index} style={styles.item}>
              {/* 名稱與開關 */}
              <View style={styles.row}>
                <View style={styles.nameRow}>
                  <Text style={styles.label}>{light.name}</Text>
                  <TouchableOpacity onPress={() => handleEditEquipment(index)}>
                    <Icon
                      name="edit"
                      size={16}
                      color="#4285F4"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelEquipment(index)}>
                    <Icon
                      name="delete"
                      size={16}
                      color="#4285F4"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <Switch
                  value={light.enabled}
                  onValueChange={() => toggleSwitch(index)}
                />
              </View>
              {/* 時間設置 */}
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>自動啟閉：</Text>
                <TouchableOpacity
                  style={styles.timeEdit}
                  onPress={() => handleEditEquipment(index)}
                >
                  <Text style={styles.timeText}>{light.autoStartTime}</Text>
                  <Icon name="edit" size={14} color="#4285F4" />
                </TouchableOpacity>
                <Text style={styles.timeLabel}>開啟</Text>
                <TouchableOpacity
                  style={styles.timeEdit}
                  onPress={() => handleEditEquipment(index)}
                >
                  <Text style={styles.timeText}>{light.autoStopTime}</Text>
                  <Icon name="edit" size={14} color="#4285F4" />
                </TouchableOpacity>
                <Text style={styles.timeLabel}>
                  {light.enabled ? '開啟' : '關閉'}
                </Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={showModal}>
            <Text style={styles.addButtonText}>新增設備</Text>
          </TouchableOpacity>
        </View>
        {/* 手寫 Modal */}
        {modalVisible && (
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>新增設備</Text>

              <Text style={styles.modalLabel}>設備名稱</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="輸入設備名稱"
                value={equipmentName}
                onChangeText={setEquipmentName}
              />

              <Text style={styles.modalLabel}>自動開始時間</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="HH:mm"
                value={autoStartTime}
                onChangeText={setAutoStartTime}
              />

              <Text style={styles.modalLabel}>自動結束時間</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="HH:mm"
                value={autoStopTime}
                onChangeText={setAutoStopTime}
              />

              <Text style={styles.modalLabel}>設備描述</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="設備描述（可選）"
                value={equipmentDescription}
                onChangeText={setEquipmentDescription}
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={hideModal}
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
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  fixedImageContainer: {
    position: 'absolute', // Fix it to the block
    right: -200,
    bottom: 0,
    zIndex: 2, // Push it behind other content
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    opacity: 0.1, // Make it subtle as a background
  },
  fixedImage: {
    width: 400,
    height: 400,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },

  item: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 4,

    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  editIcon: {
    marginLeft: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
  timeEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#4285F4',
    marginRight: 3,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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
  cancelButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  confirmButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  confirmButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default EnvironmentManagementScreen;
