import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getMonitorsByStoreId } from '../../api/admin/monitorApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { useCameraSnapshots } from '../../hooks/useCameraSnapshots';

const MonitorViewDetailScreen = () => {
  const route = useRoute();
  const store = route.params?.store;
  const dispatch = useDispatch<AppDispatch>();
  const [monitors, setMonitors] = useState([]);
  const { openInfoDialog } = useDialog();
  const [storeIP, setStoreIP] = useState<string>('');
  const { snapshots } = useCameraSnapshots(storeIP);

  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | null>(
    null
  );

  useFocusEffect(
    useCallback(() => {
      if (store) {
        setStoreIP(store.storeIP);
      }
    }, [store])
  );

  const loadMonitors = async () => {
    try {
      dispatch(showLoading());
      const response = await getMonitorsByStoreId(store.id);
      dispatch(hideLoading());

      if (response.success) {
        const formattedData = response.data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          number: item.number,
          status: !!item.status,
        }));
        setMonitors(formattedData);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: '無法獲取監視器列表',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  const selectedSnapshot = snapshots.find((s) => ~~s.id === selectedSnapshotId);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('../../assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar showLeftButton title="攝影機管理" />
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>攝影店家</Text>
            </View>

            <ScrollView contentContainerStyle={styles.listContainer}>
              <View style={styles.cardWrapper}>
                {monitors.map((monitor) => {
                  const snapshot = snapshots.find(
                    (s) => ~~s.id === ~~monitor.number
                  );

                  return (
                    <TouchableOpacity
                      key={monitor.uid}
                      style={styles.card}
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
            </ScrollView>
          </View>

          {/* 🔍 Modal Preview */}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    backgroundColor: '#4787C7',
    width: '48%',
    height: 200,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  monitorImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#ccc',
  },
  deviceItem: {
    fontSize: 15,
    color: '#fff',
    fontWeight: 'bold',
  },
  monitorStatusText: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
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
  modalClose: {
    marginTop: 20,
    color: '#007AFF',
    textAlign: 'right',
    fontWeight: '600',
  },
});

export default MonitorViewDetailScreen;
