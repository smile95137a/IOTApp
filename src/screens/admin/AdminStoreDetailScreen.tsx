import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { useDialog } from '@/context/DialogContext';
import { fetchStoreByUid } from '@/api/admin/storeApi';
import {
  fetchStoreEquipmentsByStoreId,
  updateStoreEquipmentStatus,
} from '@/api/admin/equipmentApi';
import {
  getMonitorsByStoreId,
  updateMonitorStatus,
} from '@/api/admin/monitorApi';
import HeaderBar from '@/component/admin/HeaderBar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminStoreDetailScreen = () => {
  const route = useRoute<any>();
  const store = route.params?.store;
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();

  const [storeDetail, setStoreDetail] = useState<any>(null);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const loadStoreDetail = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchStoreByUid(store.uid);
      dispatch(hideLoading());
      if (success) {
        setStoreDetail(data);
      } else {
        openInfoDialog({ title: '錯誤', content: message || '查詢失敗' });
      }
    } catch {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: '發生例外錯誤，請稍後再試' });
    }
  };

  const loadEquipments = async () => {
    try {
      dispatch(showLoading());
      const response = await fetchStoreEquipmentsByStoreId(store.id);
      dispatch(hideLoading());
      if (response.success) {
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          name: item.equipmentName,
          enabled: !!item.status,
        }));
        setEquipments(formatted);
      }
    } catch {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: '設備載入失敗' });
    }
  };

  const loadMonitors = async () => {
    try {
      dispatch(showLoading());
      const response = await getMonitorsByStoreId(store.id);
      dispatch(hideLoading());
      if (response.success) {
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          enabled: !!item.status,
        }));
        setMonitors(formatted);
      }
    } catch {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: '監控裝置載入失敗' });
    }
  };

  useEffect(() => {
    if (store) {
      loadStoreDetail();
      loadEquipments();
      loadMonitors();
    }
  }, [store]);

  const toggleEquipmentSwitch = async (index: number) => {
    const current = equipments[index];
    const updated = [...equipments];
    const newStatus = !current.enabled;
    updated[index] = { ...current, enabled: newStatus };
    setEquipments(updated);

    try {
      dispatch(showLoading());
      await updateStoreEquipmentStatus(current.id, newStatus);
      dispatch(hideLoading());
    } catch {
      dispatch(hideLoading());
      updated[index] = { ...current, enabled: !newStatus };
      setEquipments(updated);
      await openInfoDialog({
        title: '錯誤',
        content: '設備狀態更新失敗，請稍後再試',
        confirmText: '我知道了',
      });
    }
  };

  const openMonitorDetail = (monitor: any) => {
    setSelectedMonitor(monitor);
    setModalVisible(true);
  };

  const closeMonitorDetail = () => {
    setSelectedMonitor(null);
    setModalVisible(false);
  };

  const getIconName = (name: string) => {
    if (name.includes('冷氣')) return 'air-conditioner';
    if (name.includes('燈')) return 'lightbulb';
    if (name.includes('音響')) return 'speaker';
    if (name.includes('電扇')) return 'fan';
    if (name.includes('門')) return 'door';
    if (name.includes('窗')) return 'window-closed';
    if (name.includes('電視')) return 'television';
    if (name.includes('監視')) return 'cctv';
    if (name.includes('WiFi')) return 'wifi';
    if (name.includes('打卡')) return 'calendar-check';
    if (name.includes('電源')) return 'power-plug';
    return 'tools'; // fallback 預設 icon
  };
  const getTableCounts = () => {
    const tables = storeDetail?.poolTables ?? [];
    const total = tables.length;
    const used = tables.filter((t: any) => t.isUse).length;
    const unused = total - used;
    return { total, used, unused };
  };

  const tableStats = getTableCounts();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-admin-bg.png')}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <HeaderBar title="店家詳細資料" />
        </View>

        <ScrollView contentContainerStyle={styles.containers}>
          {storeDetail ? (
            <View style={styles.detailBlock}>
              <Text style={styles.label}>店家名稱</Text>
              <Text style={styles.value}>{storeDetail.name}</Text>

              <Text style={styles.label}>桌檯統計</Text>
              <View style={styles.tableStatsRow}>
                <View style={styles.statsBlockFull}>
                  <Text style={styles.statsLabel}>總數</Text>
                  <Text style={styles.statsValue}>{tableStats.total} 台</Text>
                </View>
              </View>
              <View style={styles.tableStatsRow}>
                <View style={styles.statsBlockHalf}>
                  <Text style={styles.statsLabel}>使用中</Text>
                  <Text style={styles.statsValue}>{tableStats.used} 台</Text>
                </View>
                <View style={styles.statsBlockHalf}>
                  <Text style={styles.statsLabel}>未使用</Text>
                  <Text style={styles.statsValue}>{tableStats.unused} 台</Text>
                </View>
              </View>

              <Text style={styles.label}>環境設備</Text>
              <View style={styles.sectionBlock}>
                <View style={styles.gridRow}>
                  {equipments.map((item, index) => (
                    <View key={item.id} style={styles.gridItemColumn}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 8,
                        }}
                      >
                        <MaterialCommunityIcons
                          name={getIconName(item.name)}
                          size={28}
                          color={item.enabled ? '#22C55E' : '#A1A1AA'}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={styles.deviceItem}>{item.name}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Switch
                          value={item.enabled}
                          onValueChange={() => toggleEquipmentSwitch(index)}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <Text style={styles.label}>監控裝置</Text>
              <View style={styles.sectionBlock}>
                <View style={styles.gridRow}>
                  {monitors.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.gridItemColumn,
                        !item.enabled && styles.monitorAbnormalBorder,
                      ]}
                      onPress={() => item.enabled && openMonitorDetail(item)}
                    >
                      <View>
                        <Text style={styles.deviceItem}>{item.name}</Text>
                        {!item.enabled && (
                          <Text style={styles.abnormalText}>異常狀態</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <Text>載入中...</Text>
          )}

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeMonitorDetail}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>監控裝置詳情</Text>
                <Text style={styles.modalItem}>
                  名稱：{selectedMonitor?.name}
                </Text>
                <Text style={styles.modalItem}>監控畫面：</Text>
                <Image
                  source={require('@/assets/iot-mom.jpg')}
                  style={{
                    width: '100%',
                    height: 200,
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.modalClose} onPress={closeMonitorDetail}>
                  關閉
                </Text>
              </View>
            </View>
          </Modal>
        </ScrollView>
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
    position: 'absolute',
    right: -200,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  containers: {
    padding: 20,
    backgroundColor: '#F3F4F6',
    flexGrow: 1,
  },
  detailBlock: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  label: {
    fontWeight: '600',
    marginTop: 20,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 6,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginTop: 6,
  },
  tableStatsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  statsBlockFull: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  statsBlockHalf: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  sectionBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemColumn: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  deviceItem: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    flexShrink: 1,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  monitorAbnormalBorder: {
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  abnormalText: {
    marginTop: 4,
    fontSize: 13,
    color: '#FF3B30',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 6,
    color: '#444',
  },
  modalClose: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'right',
    fontWeight: '600',
  },
});

export default AdminStoreDetailScreen;
