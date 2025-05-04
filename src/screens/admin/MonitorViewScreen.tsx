import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';
import Header from '@/component/Header';
import {
  deleteStore,
  fetchAllStores,
  fetchStoresByVendorId,
  Store,
} from '@/api/admin/storeApi';
import HeaderBar from '@/component/admin/HeaderBar';
import { useDialog } from '@/context/DialogContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchStoreListByUserId } from '@/api/admin/storeApi';

const MonitorViewScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [stores, setStores] = useState<Store[]>([]);
  const { openInfoDialog } = useDialog();
  const user = useSelector((state: RootState) => state.user);

  const loadStores = async () => {
    try {
      dispatch(showLoading());

      const userId = user?.user?.id;
      if (!userId) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: '使用者資訊錯誤，無法載入店家列表',
          confirmText: '我知道了',
        });
        return;
      }

      const { success, data, message } = await fetchStoreListByUserId(userId);
      dispatch(hideLoading());

      if (success) {
        setStores(data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入店家資訊',
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
    loadStores();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStores(); // 當頁面獲取焦點時刷新數據
    }, [])
  );

  return (
    <Provider>
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
            <HeaderBar title="選擇店家" showLeftButton />
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridWrapper}>
                {stores.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.cardWrapper}
                    onPress={() =>
                      (navigation as any).navigate('MonitorViewDetail', {
                        storeId: item.id,
                      })
                    }
                  >
                    <Image
                      source={require('../../assets/iot-logo-black.png')}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Provider>
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
  scrollContent: { paddingBottom: 20 },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    width: '48%',
    height: 128,
    borderRadius: 20,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: '1%',
  },
  cardImage: { width: '100%', height: '100%', flex: 1, resizeMode: 'contain' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardWrapper: {
    backgroundColor: '#FFC702',
    width: '48%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  addCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  addCardText: { fontSize: 16, fontWeight: 'bold' },
  addIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuStyle: { backgroundColor: '#FFF', borderRadius: 10 },
});

export default MonitorViewScreen;
