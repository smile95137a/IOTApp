import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Buffer } from 'buffer';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getMonitorsByStoreId } from '../../api/admin/monitorApi';
import { getErrorMessage } from '../../utils/errorUtils';
import { useCameraSnapshots } from '../../hooks/useCameraSnapshots';
import { getRecordDates } from '../../hooks/useRecordDates';
import { useAutoReplay } from '../../hooks/useAutoReplay';

const AUTH_HEADER = {
  Authorization: 'Basic ' + Buffer.from('admin:123456').toString('base64'),
};

const ensureHttpPrefix = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `http://${url}`;
  }
  return url;
};

const MonitorViewDetailScreen = () => {
  const route = useRoute();
  const store = route.params?.store;
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const [storeIP, setStoreIP] = useState('');
  const [monitors, setMonitors] = useState([]);
  const { snapshots } = useCameraSnapshots(storeIP);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | null>(
    null
  );
  const [playbackImage, setPlaybackImage] = useState<string | null>(null);
  const [playbackModalVisible, setPlaybackModalVisible] = useState(false);
  const [recordDates, setRecordDates] = useState<string[]>([]);
  const [replayDate, setReplayDate] = useState('');
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const replayImage = useAutoReplay(
    storeIP,
    selectedSnapshotId ?? 1,
    replayDate,
    isReplaying
  );

  useFocusEffect(
    useCallback(() => {
      if (store) setStoreIP(store.storeIP);
    }, [store])
  );

  useEffect(() => {
    const loadMonitors = async () => {
      try {
        dispatch(showLoading());
        const response = await getMonitorsByStoreId(store.id);
        dispatch(hideLoading());
        if (response.success) {
          setMonitors(response.data);
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: '無法獲取監視器列表',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };
    loadMonitors();
  }, []);

  const fetchPlaybackImage = async (channelId: number, datetime: string) => {
    try {
      dispatch(showLoading());
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <config version="1.0" xmlns="http://www.ipc.com/ver10">
        <search>
          <time type="string"><![CDATA[${datetime}]]></time>
          <length type="uint16">10</length>
        </search>
      </config>`;

      const res = await axios.post(
        `${ensureHttpPrefix(storeIP)}/GetSnapshotByTime/${channelId}`,
        xml,
        {
          headers: { ...AUTH_HEADER, 'Content-Type': 'application/xml' },
          responseType: 'blob',
        }
      );

      setPlaybackImage(URL.createObjectURL(res.data));
    } catch (err: any) {
      await openInfoDialog({ title: '錯誤', content: getErrorMessage(err) });
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleFetchRecordDates = async () => {
    const today = new Date().toISOString().slice(0, 10);
    const result = await getRecordDates(
      storeIP,
      selectedSnapshotId ?? 1,
      '2025-01-01',
      today
    );
    setRecordDates(result);
  };

  const handleConfirmTime = (date: Date) => {
    setSelectedTime(date);
    setShowTimePicker(false);
  };

  const handleOpenModal = (monitorNumber: number) => {
    setSelectedSnapshotId(monitorNumber);
    setPlaybackImage(null);
    setReplayDate('');
    setSelectedTime(null);
    handleFetchRecordDates();
    setPlaybackModalVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <HeaderBar showLeftButton title="攝影機管理" />
          <ScrollView contentContainerStyle={styles.listContainer}>
            {monitors.map((monitor) => {
              const snapshot = snapshots.find(
                (s) => ~~s.id === ~~monitor.number
              );
              return (
                <View key={monitor.uid} style={styles.monitorCard}>
                  <Text style={styles.monitorCard__title}>{monitor.name}</Text>
                  <Text
                    style={
                      snapshot
                        ? styles.monitorCard__statusOnline
                        : styles.monitorCard__statusOffline
                    }
                  >
                    {snapshot ? '在線' : '離線'}
                  </Text>
                  <TouchableOpacity
                    style={styles.monitorCard__button}
                    onPress={() => handleOpenModal(monitor.number)}
                  >
                    <Text style={styles.monitorCard__buttonText}>錄影回放</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.monitorCard__button}
              onPress={() => setIsReplaying((prev) => !prev)}
            >
              <Text style={styles.monitorCard__buttonText}>
                {isReplaying ? '停止輪播' : '開始輪播'}
              </Text>
            </TouchableOpacity>

            {isReplaying && replayImage && (
              <Image
                source={{ uri: replayImage }}
                style={styles.replayImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>

          {/* 日期時間 Modal */}
          <Modal
            visible={playbackModalVisible}
            transparent
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>錄影回放</Text>

                {recordDates.length > 0 ? (
                  <ScrollView style={{ maxHeight: 150 }}>
                    {recordDates.map((date) => (
                      <TouchableOpacity
                        key={date}
                        style={[
                          styles.recordDateItem,
                          replayDate === date && { backgroundColor: '#ddd' },
                        ]}
                        onPress={() => setReplayDate(date)}
                      >
                        <Text style={styles.recordDateItem__text}>{date}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <Text>尚無可用錄影資料</Text>
                )}

                {replayDate ? (
                  <>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => setShowTimePicker(true)}
                    >
                      <Text style={styles.modalButtonText}>
                        {selectedTime
                          ? `選擇時間：${moment(selectedTime).format(
                              'HH:mm:ss'
                            )}`
                          : '選擇時間'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() =>
                        selectedSnapshotId &&
                        selectedTime &&
                        fetchPlaybackImage(
                          selectedSnapshotId,
                          `${replayDate} ${moment(selectedTime).format(
                            'HH:mm:ss'
                          )}`
                        )
                      }
                    >
                      <Text style={styles.modalButtonText}>查詢畫面</Text>
                    </TouchableOpacity>
                  </>
                ) : null}

                {playbackImage && (
                  <Image
                    source={{ uri: playbackImage }}
                    style={styles.replayImage}
                    resizeMode="contain"
                  />
                )}

                <Text
                  style={styles.modalClose}
                  onPress={() => setPlaybackModalVisible(false)}
                >
                  關閉
                </Text>
              </View>
            </View>
          </Modal>

          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={() => setShowTimePicker(false)}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  listContainer: { padding: 16 },
  monitorCard: {
    backgroundColor: '#4787C7',
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
  },
  monitorCard__title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  monitorCard__statusOnline: {
    color: '#4CAF50',
    marginBottom: 8,
  },
  monitorCard__statusOffline: {
    color: '#FF3B30',
    marginBottom: 8,
  },
  monitorCard__button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  monitorCard__buttonText: {
    color: '#4787C7',
    fontWeight: 'bold',
  },
  recordDateItem: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  recordDateItem__text: {
    fontSize: 14,
  },
  replayImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalClose: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MonitorViewDetailScreen;
