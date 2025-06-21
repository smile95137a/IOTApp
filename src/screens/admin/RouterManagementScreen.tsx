// RouterManagementScreen (完整版) - 對應 AddRouterRequest 所有欄位
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
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import {
  fetchRoutersByStoreId,
  createRouter,
  deleteRouter,
} from '../../api/admin/routerApi';

const RouterManagementScreen = ({ navigation }) => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [routers, setRouters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [form, setForm] = useState({
    circuitName: '',
    circuitNumber: '',
    circuitType: 'DO',
    modbusAddress: '',
    slaveId: '',
    routerIP: '',
    isControllable: true,
  });

  const resetForm = () => {
    setForm({
      circuitName: '',
      circuitNumber: '',
      circuitType: 'DO',
      modbusAddress: '',
      slaveId: '',
      routerIP: '',
      isControllable: true,
    });
  };

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
      resetForm();
    });
  };

  const loadRouters = async () => {
    try {
      dispatch(showLoading());
      const res = await fetchRoutersByStoreId(storeId);
      dispatch(hideLoading());
      if (res.success) setRouters(res.data);
    } catch (e) {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: getErrorMessage(e) });
    }
  };

  const handleAddRouter = async () => {
    if (!form.circuitName || !form.circuitNumber) {
      await openInfoDialog({ title: '錯誤', content: '請填寫必要欄位' });
      return;
    }
    try {
      dispatch(showLoading());
      const res = await createRouter({
        storeId,
        routerId: null,
        ...form,
        circuitNumber: ~~form.circuitNumber,
        modbusAddress: ~~form.modbusAddress,
        slaveId: ~~form.slaveId,
      });
      dispatch(hideLoading());
      if (res.success) {
        hideModal();
        loadRouters();
      }
    } catch (e) {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: getErrorMessage(e) });
    }
  };

  const handleDelete = async (router) => {
    const confirmed = await openConfirmDialog({
      title: '確認刪除',
      content: `確定要刪除 Router「${router.circuitName}」嗎？`,
      confirmText: '刪除',
    });
    if (!confirmed) return;
    try {
      dispatch(showLoading());
      await deleteRouter(router.id);
      dispatch(hideLoading());
      loadRouters();
    } catch (e) {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: getErrorMessage(e) });
    }
  };

  useEffect(() => {
    loadRouters();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderBar showLeftButton title="Router 管理" />
        <ScrollView contentContainerStyle={styles.content}>
          {routers.map((r, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.label}>
                {r.circuitName}（頻道 {r.circuitNumber}）
              </Text>
              <TouchableOpacity onPress={() => handleDelete(r)}>
                <Icon name="delete" size={20} color="#f00" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={showModal}>
            <Text style={styles.addButtonText}>新增 Router</Text>
          </TouchableOpacity>
        </ScrollView>

        {modalVisible && (
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>新增 Router</Text>
              {[
                'circuitName',
                'circuitNumber',
                'modbusAddress',
                'slaveId',
                'routerIP',
              ].map((key) => (
                <TextInput
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChangeText={(val) => setForm((f) => ({ ...f, [key]: val }))}
                  keyboardType={
                    ['circuitNumber', 'modbusAddress', 'slaveId'].includes(key)
                      ? 'numeric'
                      : 'default'
                  }
                  style={styles.modalInput}
                />
              ))}
              <Text>類型</Text>
              <View style={styles.row}>
                {['DO', 'Relay', 'AI'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() =>
                      setForm((f) => ({ ...f, circuitType: type }))
                    }
                    style={[
                      styles.typeBtn,
                      form.circuitType === type && styles.typeBtnActive,
                    ]}
                  >
                    <Text>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.row}>
                <Text>是否可控制</Text>
                <Switch
                  value={form.isControllable}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, isControllable: val }))
                  }
                />
              </View>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={hideModal}>
                  <Text>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleAddRouter}
                >
                  <Text>送出</Text>
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
  safeArea: { flex: 1 },
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  content: { padding: 20 },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { fontSize: 16, color: '#333' },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: { color: '#fff', fontSize: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelBtn: {
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeBtnActive: {
    backgroundColor: '#d0f0c0',
    borderColor: '#28a745',
  },
});

export default RouterManagementScreen;
