// RouterManagementScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import {
  fetchRoutersByStoreId,
  createRouter,
  updateRouter,
  deleteRouter,
  controlRouter,
} from '../../api/admin/routerApi';
import { logJson } from '../../utils/logJsonUtils';

const RouterManagementScreen = () => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [routers, setRouters] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRouter, setEditingRouter] = useState(null);
  const [form, setForm] = useState({
    circuitName: '',
    circuitNumber: '',
    circuitType: 'DO',
    modbusAddress: '',
    slaveId: '',
    isControllable: true,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const resetForm = () => {
    setForm({
      circuitName: '',
      circuitNumber: '',
      circuitType: 'DO',
      modbusAddress: '',
      slaveId: '',
      isControllable: true,
    });
    setEditingRouter(null);
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
      logJson('zx', res);
      dispatch(hideLoading());
      if (res.success) setRouters(res.data);
    } catch (e) {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: getErrorMessage(e) });
    }
  };

  const handleAddOrUpdateRouter = async () => {
    if (!form.circuitName || !form.circuitNumber) {
      await openInfoDialog({ title: '錯誤', content: '請填寫必要欄位' });
      return;
    }
    try {
      dispatch(showLoading());
      const payload = {
        ...form,
        storeId,
        circuitNumber: ~~form.circuitNumber,
        modbusAddress: ~~form.modbusAddress,
        slaveId: ~~form.slaveId,
      };
      const res = editingRouter
        ? await updateRouter(editingRouter.id, { ...payload })
        : await createRouter({ ...payload, routerId: null });

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

  const handleEdit = (router) => {
    setForm({
      circuitName: router.circuitName,
      circuitNumber: String(router.circuitNumber),
      circuitType: router.circuitType,
      modbusAddress: String(router.modbusAddress),
      slaveId: String(router.slaveId),
      isControllable: router.isControllable,
    });
    setEditingRouter(router);
    showModal();
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.fixedImageContainer}>
            <Image
              source={require('../../assets/iot-admin-bg.png')}
              resizeMode="contain"
            />
          </View>
          <HeaderBar showLeftButton title="Router 管理" />
          <ScrollView style={styles.mainContainer}>
            {routers.map((router, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.row}>
                  <View style={styles.nameRow}>
                    <Text style={styles.label}>{router.circuitName}</Text>
                    <TouchableOpacity onPress={() => handleEdit(router)}>
                      <Icon
                        name="edit"
                        size={16}
                        color="#4285F4"
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(router)}>
                      <Icon
                        name="delete"
                        size={16}
                        color="#f00"
                        style={styles.editIcon}
                      />
                    </TouchableOpacity>
                  </View>
                  <Switch
                    value={router.isControllable}
                    onValueChange={async (val) => {
                      const updated = [...routers];
                      updated[index].isControllable = val;
                      setRouters(updated); // Optimistic update

                      try {
                        dispatch(showLoading());
                        await controlRouter({
                          routerId: router.id,
                          isControllable: val,
                        });
                        dispatch(hideLoading());
                      } catch (e) {
                        dispatch(hideLoading());
                        // 還原狀態
                        updated[index].isControllable = !val;
                        setRouters(updated);
                        openInfoDialog({
                          title: '錯誤',
                          content: getErrorMessage(e),
                        });
                      }
                    }}
                  />
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={showModal}>
              <Text style={styles.addButtonText}>新增 Router</Text>
            </TouchableOpacity>
          </ScrollView>

          {modalVisible && (
            <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {editingRouter ? '編輯 Router' : '新增 Router'}
                </Text>
                {[
                  'circuitName',
                  'circuitNumber',
                  'modbusAddress',
                  'slaveId',
                ].map((key) => (
                  <TextInput
                    key={key}
                    placeholder={key}
                    value={form[key]}
                    onChangeText={(val) =>
                      setForm((f) => ({ ...f, [key]: val }))
                    }
                    keyboardType={
                      ['circuitNumber', 'modbusAddress', 'slaveId'].includes(
                        key
                      )
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
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={hideModal}
                  >
                    <Text>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleAddOrUpdateRouter}
                  >
                    <Text>送出</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, backgroundColor: '#E3F2FD' },
  mainContainer: { flex: 1, padding: 20 },
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
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginRight: 5 },
  editIcon: { marginLeft: 5 },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: { color: 'white', fontSize: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
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
  fixedImageContainer: {
    position: 'absolute',
    right: -200,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
});

export default RouterManagementScreen;
