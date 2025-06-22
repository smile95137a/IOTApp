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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchStoreEquipmentsByStoreId,
  updateStoreEquipmentStatus,
} from '../../api/admin/equipmentApi';
import { getMonitorsByStoreId } from '../../api/admin/monitorApi';
import {
  fetchPoolTablesByStoreId,
  closePoolTable,
  updatePoolTable,
} from '../../api/admin/poolTableApi';
import { fetchStoreByUid, fetchStoreReport } from '../../api/admin/storeApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { getErrorMessage } from '../../utils/errorUtils';
import { logJson } from '../../utils/logJsonUtils';
import { useCameraSnapshots } from '../../hooks/useCameraSnapshots';

const AdminStoreDetailScreen = () => {
  const route = useRoute<any>();
  const store = route.params?.store;
  const dispatch = useDispatch();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [storeDetail, setStoreDetail] = useState<any>(null);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [monitors, setMonitors] = useState<any[]>([]);
  const [poolTables, setPoolTables] = useState<any[]>([]);

  const [selectedMonitor, setSelectedMonitor] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [storeReport, setStoreReport] = useState<any>(null);
  const [monitorExpandedMap, setMonitorExpandedMap] = useState<{
    [id: number]: boolean;
  }>({});

  const { snapshots, error: cameraError } = useCameraSnapshots(store.storeIP);

  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | null>(
    null
  );

  const loadStoreReport = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchStoreReport(store.uid);
      dispatch(hideLoading());

      if (success) {
        setStoreReport(data);
      } else {
        openInfoDialog({
          title: '錯誤',
          content: message || '營收資料載入失敗',
        });
      }
    } catch {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: '營收資料載入失敗' });
    }
  };

  const loadPoolTables = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchPoolTablesByStoreId(
        store.id
      );
      dispatch(hideLoading());

      if (success) {
        setPoolTables(data);
      } else {
        openInfoDialog({
          title: '錯誤',
          content: message || '桌檯資料載入失敗',
        });
      }
    } catch {
      dispatch(hideLoading());
      openInfoDialog({ title: '錯誤', content: '桌檯資料載入失敗' });
    }
  };

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
        logJson(',', response.data);
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          name: item.equipmentName,
          enabled: !!item.status,
          status: item.status,
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
          number: item.number,
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
      loadPoolTables();
      loadStoreReport();
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
    const total = poolTables.length;
    const used = poolTables.filter((t: any) => t.isUse).length;
    const unused = poolTables.filter(
      (t: any) => !t.isUse && t.status !== 'FAULT'
    ).length;
    const fault = poolTables.filter((t: any) => t.status === 'FAULT').length;
    return { total, used, unused, fault };
  };

  const tableStats = getTableCounts();

  const handleForceClose = async (table: any) => {
    if (!table.isUse) {
      await openInfoDialog({
        title: '無法關台',
        content: '該桌檯目前未使用中，無需關台。',
      });
      return;
    }

    const confirm = await openConfirmDialog({
      title: '確認強制關台？',
      content: `確定要強制關閉 ${table.tableName || `桌檯 ${table.id}`} 嗎？`,
      confirmText: '確認',
      cancelText: '取消',
    });

    if (confirm) {
      try {
        dispatch(showLoading());
        await closePoolTable({ tableUId: table.uid });
        dispatch(hideLoading());
        await openInfoDialog({ title: '成功', content: '已強制關台' });
        loadPoolTables();
      } catch {
        dispatch(hideLoading());
        openInfoDialog({ title: '錯誤', content: '強制關台失敗，請稍後再試' });
      }
    }
  };
  const handleReportIssue = async (table: any) => {
    const confirm = await openConfirmDialog({
      title: '確認通報？',
      content: `是否將「${
        table.tableNumber || `桌檯 ${table.id}`
      }」標記為設備故障？通報後狀態將變更為「故障」，並取消所有預約單。`,
      confirmText: '通報',
      cancelText: '取消',
    });

    if (!confirm) return;

    try {
      dispatch(showLoading());

      await updatePoolTable(table.uid, {
        tableNumber: table.tableNumber,
        status: 'FAULT',
        store: { id: table.storeId || store.id },
        isUse: table.isUse,
      });

      dispatch(hideLoading());

      await openInfoDialog({
        title: '成功',
        content: '已通報設備故障',
      });

      loadPoolTables();
    } catch (error: any) {
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const selectedSnapshot = snapshots.find(
    (s) => Number(s.id) === selectedSnapshotId
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('../../assets/iot-admin-bg.png')}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <HeaderBar showLeftButton title="店家詳細資料" />
        </View>

        <ScrollView contentContainerStyle={styles.containers}>
          <View style={styles.detailBlock}>
            {storeDetail && (
              <>
                <Text style={styles.label}>店家名稱</Text>
                <Text style={styles.value}>{storeDetail.name}</Text>
              </>
            )}
            {storeReport && (
              <>
                <Text style={styles.label}>今日營運數據</Text>
                <View style={styles.sectionBlock}>
                  <Text style={styles.value}>
                    消費金額：{storeReport.todayTotalAmount || 0} 元 /
                    {storeReport.todayTransactionCount || 0} 筆
                  </Text>
                  <Text style={styles.value}>
                    儲值金額：{storeReport.todayTopupAmount || 0} 元 /
                    {storeReport.todayTopupCount || 0} 筆
                  </Text>
                </View>
              </>
            )}
            <Text style={styles.label}>監控裝置</Text>
            <View style={styles.sectionBlock}>
              <View style={styles.gridRow}>
                {monitors.map((monitor) => {
                  const snapshot = snapshots.find(
                    (s) => ~~s.id === ~~monitor.number
                  );

                  return (
                    <TouchableOpacity
                      key={monitor.id}
                      style={styles.gridItemHalf}
                      onPress={() =>
                        snapshot && setSelectedSnapshotId(Number(snapshot.id))
                      }
                      disabled={!snapshot}
                    >
                      {snapshot ? (
                        <Image
                          source={{ uri: snapshot.image }}
                          style={styles.monitorImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.monitorImage,
                            { justifyContent: 'center', alignItems: 'center' },
                          ]}
                        >
                          <Text style={{ color: '#888', fontSize: 14 }}>
                            無畫面
                          </Text>
                        </View>
                      )}
                      <View style={{ marginTop: 10, alignItems: 'center' }}>
                        <Text style={styles.deviceItem}>{monitor.name}</Text>
                        <Text
                          style={[
                            styles.monitorStatusText,
                            { color: snapshot ? '#4CAF50' : '#999' },
                          ]}
                        >
                          {snapshot ? '正常' : '離線/未連線'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {storeDetail ? (
              <>
                <Text style={styles.label}>桌台設備統計</Text>
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
                    <Text style={styles.statsValue}>
                      {tableStats.unused} 台
                    </Text>
                  </View>
                </View>
                <View style={styles.tableStatsRow}>
                  <View style={styles.statsBlockHalf}>
                    <Text style={styles.statsLabel}>故障數量</Text>
                    <Text style={styles.statsValue}>{tableStats.fault} 台</Text>
                  </View>
                </View>

                <Text style={styles.label}>桌台設備</Text>
                <View style={styles.sectionBlock}>
                  {poolTables.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#999' }}>
                      尚無桌檯資料
                    </Text>
                  ) : (
                    poolTables.map((table) => (
                      <View key={table.id} style={styles.poolTableCard}>
                        <View style={styles.poolTableRow}>
                          <Text style={styles.poolTableName}>
                            桌檯名稱：{table.tableNumber || `桌檯 ${table.id}`}
                          </Text>
                          <Text
                            style={[
                              styles.poolTableStatus,
                              {
                                color:
                                  table.status === 'FAULT'
                                    ? '#FF9800'
                                    : table.isUse
                                    ? '#C62828'
                                    : '#388E3C',
                              },
                            ]}
                          >
                            {table.status === 'FAULT'
                              ? '故障'
                              : table.isUse
                              ? '使用中'
                              : '空閒'}
                          </Text>
                        </View>

                        <View style={styles.buttonRow}>
                          <TouchableOpacity
                            style={[
                              styles.forceCloseButton,
                              table.status === 'FAULT' && {
                                backgroundColor: '#ccc',
                              },
                            ]}
                            disabled={table.status === 'FAULT'}
                            onPress={() => handleForceClose(table)}
                          >
                            <Text style={styles.forceCloseText}>強制關台</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[
                              styles.reportIssueButton,
                              table.status === 'FAULT' && {
                                backgroundColor: '#ccc',
                              },
                            ]}
                            disabled={table.status === 'FAULT'}
                            onPress={() => handleReportIssue(table)}
                          >
                            <Text style={styles.reportIssueText}>通報故障</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
                <Text style={styles.label}>環境設備統計</Text>
                {equipments.length > 0 && (
                  <>
                    <View style={styles.tableStatsRow}>
                      <View style={styles.statsBlockFull}>
                        <Text style={styles.statsLabel}>總數</Text>
                        <Text style={styles.statsValue}>
                          {equipments.length} 台
                        </Text>
                      </View>
                    </View>
                    <View style={styles.tableStatsRow}>
                      <View style={styles.statsBlockHalf}>
                        <Text style={styles.statsLabel}>啟用中</Text>
                        <Text style={styles.statsValue}>
                          {equipments.filter((e) => e.enabled).length} 台
                        </Text>
                      </View>
                      <View style={styles.statsBlockHalf}>
                        <Text style={styles.statsLabel}>未啟用</Text>
                        <Text style={styles.statsValue}>
                          {equipments.filter((e) => !e.enabled).length} 台
                        </Text>
                      </View>
                    </View>
                  </>
                )}
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
              </>
            ) : (
              <Text>載入中...</Text>
            )}
            <Modal
              visible={!!selectedSnapshotId}
              transparent
              animationType="fade"
              onRequestClose={() => setSelectedSnapshotId(null)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {selectedSnapshot?.name || '監控畫面'} - 放大預覽
                  </Text>
                  <Image
                    source={{ uri: selectedSnapshot?.image }}
                    style={{
                      width: '100%',
                      height: 220,
                      borderRadius: 8,
                      marginTop: 12,
                      backgroundColor: '#ccc',
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={styles.modalClose}
                    onPress={() => setSelectedSnapshotId(null)}
                  >
                    關閉
                  </Text>
                </View>
              </View>
            </Modal>
          </View>
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
    width: '100%',
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
  poolTableCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  poolTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  poolTableName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  poolTableStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  forceCloseButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  forceCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reportIssueButton: {
    backgroundColor: '#F97316', // 橘色
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  reportIssueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridItemHalf: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'stretch',
  },

  monitorImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: 'lightgray',
  },

  monitorStatusText: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 13,
  },
});

export default AdminStoreDetailScreen;
