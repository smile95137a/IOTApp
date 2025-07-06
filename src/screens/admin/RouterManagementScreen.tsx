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
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import {
  createRouter,
  updateRouter,
  deleteRouter,
  fetchRoutersByStoreId,
  controlRouter,
} from '../../api/admin/routerApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { logJson } from '../../utils/logJsonUtils';

const RouterManagementScreen = () => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [routers, setRouters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [routerId, setRouterId] = useState(null);
  const [circuitName, setCircuitName] = useState('');
  const [circuitNumber, setCircuitNumber] = useState('');
  const [routerPort, setRouterPort] = useState('');
  const [isControllable, setIsControllable] = useState(true);
  const [circuitType, setCircuitType] = useState('DO');
  const [modbusAddress, setModbusAddress] = useState('');
  const [slaveId, setSlaveId] = useState('');

  const [editingRouterIndex, setEditingRouterIndex] = useState(null);

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

  const handleEditRouter = (index) => {
    const router = routers[index];
    setRouterId(router.id);
    setCircuitName(router.circuitName);
    setCircuitNumber(router.circuitNumber ? String(router.circuitNumber) : '');
    setRouterPort(router.routerPort ? String(router.routerPort) : '');
    setIsControllable(router.isControllable);
    setCircuitType(router.circuitType || 'DO');
    setModbusAddress(router.modbusAddress ? String(router.modbusAddress) : '');
    setSlaveId(router.slaveId ? String(router.slaveId) : '');

    setEditingRouterIndex(index);
    showModal();
  };

  const handleAddOrUpdateRouter = async () => {
    if (!circuitName.trim()) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫完整設備資訊',
        confirmText: '我知道了',
      });
      return;
    }

    try {
      dispatch(showLoading());
      let response;
      const payload = {
        storeId,
        circuitName,
        circuitNumber: ~~circuitNumber,
        routerPort: ~~routerPort,
        isControllable,
        circuitType,
        modbusAddress: ~~modbusAddress,
        slaveId: ~~slaveId,
      };

      if (routerId === null) {
        response = await createRouter({ ...payload });
      } else {
        response = await updateRouter(routerId, { ...payload });
      }

      dispatch(hideLoading());
      if (response.success) {
        loadRouters();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: '無法獲取 Router 資料',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }

    // reset
    setRouterId(null);
    setCircuitName('');
    setCircuitNumber('');
    setRouterPort('');
    setIsControllable(true);
    setEditingRouterIndex(null);
    setModalVisible(false);
  };

  const handleDelRouter = async (index) => {
    const confirmed = await openConfirmDialog({
      title: '確認刪除',
      content: `確定要刪除 Router「${routers[index].circuitName}」嗎？`,
      confirmText: '刪除',
      cancelText: '取消',
    });

    if (!confirmed) return;

    try {
      dispatch(showLoading());
      const target = routers[index];
      const response = await deleteRouter(target.id);
      dispatch(hideLoading());

      if (response.success) {
        const updated = routers.filter((_, i) => i !== index);
        setRouters(updated);
        await openInfoDialog({
          title: '成功',
          content: 'Router 已刪除',
          confirmText: '我知道了',
        });
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: '刪除 Router 失敗，請稍後再試',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const loadRouters = async () => {
    try {
      dispatch(showLoading());
      const response = await fetchRoutersByStoreId(storeId);
      dispatch(hideLoading());

      if (response.success) {
        setRouters(response.data);
        logJson('loadRouters', response.data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: '無法獲取 Router 列表',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const toggleSwitch = async (index) => {
    const router = routers[index];
    const newStatus = !router.isControllable;
    const updated = [...routers];
    const storeId = route.params?.storeId;
    updated[index].targetStatus = newStatus;
    setRouters(updated);

    try {
      dispatch(showLoading());
      await controlRouter({
        routerId: router.id,
        targetStatus: newStatus,
        storeId: storeId,
      });
      dispatch(hideLoading());
      loadRouters();
    } catch (error) {
      if (error.isAutoLogout) return;
      updated[index].targetStatus = !newStatus;
      setRouters(updated);
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    loadRouters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('../../assets/iot-admin-bg.png')}
            style={{ width: '100%' }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.header}>
          <HeaderBar showLeftButton title="Router 管理" />
        </View>
        <View style={styles.mainContainer}>
          <ScrollView style={styles.equipmentList}>
            {routers.map((router, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.row}>
                  <View style={styles.nameRow}>
                    <Text style={styles.label}>{router.circuitName}</Text>
                    <TouchableOpacity onPress={() => handleEditRouter(index)}>
                      <Icon
                        name="edit"
                        size={16}
                        color="#4285F4"
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelRouter(index)}>
                      <Icon
                        name="delete"
                        size={16}
                        color="#4285F4"
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <Switch
                    value={!!router.isControllable}
                    onValueChange={() => toggleSwitch(index)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.addButton} onPress={showModal}>
            <Text style={styles.addButtonText}>新增 Router</Text>
          </TouchableOpacity>
        </View>
        {modalVisible && (
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>新增 Router</Text>

                <Text style={styles.modalLabel}>Router 名稱</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="輸入 Router 名稱"
                  value={circuitName}
                  onChangeText={setCircuitName}
                />
                {/* <Text style={styles.modalLabel}>頻道號碼</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="輸入頻道號碼"
                  value={circuitNumber}
                  onChangeText={setCircuitNumber}
                  keyboardType="numeric"
                /> */}
                <Text style={styles.modalLabel}>Port 編號</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="輸入 Port 編號"
                  value={routerPort}
                  onChangeText={setRouterPort}
                  keyboardType="numeric"
                />
                <Text style={styles.modalLabel}>Modbus 位址</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="輸入 Modbus 位址"
                  value={modbusAddress}
                  onChangeText={setModbusAddress}
                  keyboardType="numeric"
                />

                <Text style={styles.modalLabel}>Slave ID</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="輸入 Slave ID"
                  value={slaveId}
                  onChangeText={setSlaveId}
                  keyboardType="numeric"
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
                    onPress={handleAddOrUpdateRouter}
                  >
                    <Text style={styles.confirmButtonText}>確定</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
  },
  fixedImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
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
  equipmentList: {
    flex: 1,
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
  typeBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 10,
  },
  typeBtnActive: {
    backgroundColor: '#d0f0c0',
    borderColor: '#28a745',
  },
});

export default RouterManagementScreen;
