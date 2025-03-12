import {
  createStoreEquipment,
  fetchAllStoreEquipments,
  fetchStoreEquipmentById,
  fetchStoreEquipmentsByStoreId,
  updateStoreEquipment,
  updateStoreEquipmentStatus,
} from '@/api/admin/equipmentApi';
import {
  createMonitor,
  deleteMonitor,
  getMonitorsByStoreId,
  updateMonitor,
} from '@/api/admin/monitorApi';
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

const MonitorManagementScreen = ({ navigation }) => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();

  const [monitors, setMonitors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [monitorId, setMonitorId] = useState(null);
  const [monitorName, setMonitorName] = useState('');
  const [monitorStatus, setMonitorStatus] = useState(false);
  const [editingMonitorIndex, setEditingMonitorIndex] = useState(null);

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

  const handleEditMonitor = (index: any) => {
    const monitor: any = monitors[index];
    setMonitorId(monitor.uid);
    setMonitorName(monitor.name);
    setMonitorStatus(monitor.status);
    setEditingMonitorIndex(index);
    showModal();
  };

  const handleDeleteEquipment = (index: any) => {
    Alert.alert('確認刪除', '確定要刪除此設備嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: () => {
          const updatedMonitors = monitors.filter((_, i) => i !== index);
          setMonitors(updatedMonitors);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddOrUpdateEquipment = async () => {
    if (!monitorName.trim()) {
      Alert.alert('錯誤', '請填寫完整設備資訊');
      return;
    }

    try {
      dispatch(showLoading());
      let response;
      if (monitorId === null) {
        response = await createMonitor({
          name: monitorName,
          storeId: storeId,
        });
      } else {
        response = await updateMonitor({
          name: monitorName,
          uid: monitorId,
          status: monitorStatus,
          storeId: storeId,
        });
      }

      dispatch(hideLoading());
      if (response.success) {
        loadMonitors();
      } else {
        Alert.alert('錯誤', '無法獲取供應商列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }

    // 清空欄位 & 關閉 Modal
    setMonitorId(null);
    setMonitorName('');
    setMonitorStatus(false);
    setEditingMonitorIndex(null);
    setModalVisible(false);
  };

  const handleDelMonitor = (index: number) => {
    Alert.alert('確認刪除', '確定要刪除此監視器嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const monitorToDelete = monitors[index];

            // 調用 API 刪除設備
            const response = await deleteMonitor(monitorToDelete.id);
            dispatch(hideLoading());

            if (response.success) {
              // 更新狀態，從列表中移除
              const updatedMonitors = monitors.filter((_, i) => i !== index);
              setMonitors(updatedMonitors);
              Alert.alert('成功', '設備已刪除');
            } else {
              Alert.alert('錯誤', '刪除設備失敗，請稍後再試');
            }
          } catch (error) {
            dispatch(hideLoading());
            console.error('刪除監視器失敗:', error);
            Alert.alert('錯誤', '發生錯誤，請稍後再試');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const loadMonitors = async () => {
    try {
      dispatch(showLoading());
      const response = await getMonitorsByStoreId(storeId);
      dispatch(hideLoading());

      if (response.success) {
        const formattedData = response.data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          status: !!item.status,
        }));

        setMonitors(formattedData);
      } else {
        Alert.alert('錯誤', '無法獲取供應商列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '獲取供應商失敗');
    }
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  const toggleSwitch = async (index: any) => {
    const selectedMonitor: any = monitors[index];
    const newStatus = !selectedMonitor.status;
    const updatedMonitors = [...monitors];
    updatedMonitors[index].status = newStatus;
    setMonitors(updatedMonitors);

    try {
      dispatch(showLoading());
      await updateMonitor({
        name: selectedMonitor.name,
        uid: selectedMonitor.uid,
        status: newStatus,
        storeId: storeId,
      });
      dispatch(hideLoading());
      loadMonitors();
      console.log('設備狀態更新成功！');
    } catch (error) {
      console.error('更新設備狀態失敗:', error);
      updatedMonitors[index].status = !newStatus;
      setMonitors([...updatedMonitors]);
      Alert.alert('錯誤', '無法更新設備狀態，請稍後再試');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            resizeMode="contain"
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header title="環境管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {monitors.map((monitor, index) => (
            <View key={index} style={styles.item}>
              {/* 名稱與開關 */}
              <View style={styles.row}>
                <View style={styles.nameRow}>
                  <Text style={styles.label}>{monitor.name}</Text>
                  <TouchableOpacity onPress={() => handleEditMonitor(index)}>
                    <Icon
                      name="edit"
                      size={16}
                      color="#4285F4"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelMonitor(index)}>
                    <Icon
                      name="delete"
                      size={16}
                      color="#4285F4"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <Switch
                  value={monitor.status}
                  onValueChange={() => toggleSwitch(index)}
                />
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
                value={monitorName}
                onChangeText={setMonitorName}
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

export default MonitorManagementScreen;
