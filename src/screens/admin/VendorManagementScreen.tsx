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
} from '@/api/admin/storeApi';
import { Vendor, fetchAllVendors, deleteVendor } from '@/api/admin/vendorApi';
import HeaderBar from '@/component/admin/HeaderBar';
import { useDialog } from '@/context/DialogContext';

const VendorManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const navigation = useNavigation();
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const { openInfoDialog, openConfirmDialog } = useDialog();

  const loadVendors = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllVendors();
      dispatch(hideLoading());
      if (success) {
        setVendors(data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入資訊',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());

      await openInfoDialog({
        title: '錯誤',
        content: error instanceof Error ? error.message : String(error),
        confirmText: '我知道了',
      });
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadVendors(); // 當頁面獲取焦點時刷新數據
    }, [])
  );

  const handleDelete = async (uid, vendorName) => {
    const confirmed = await openConfirmDialog({
      title: '確認刪除',
      content: `確定要刪除廠商「${vendorName}」嗎？`,
      confirmText: '刪除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    try {
      dispatch(showLoading());
      const response = await deleteVendor(uid);
      dispatch(hideLoading());

      if (response.success) {
        await openInfoDialog({
          title: '成功',
          content: '廠商已刪除',
          confirmText: '我知道了',
        });
        loadVendors();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '刪除失敗',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: '刪除失敗，請稍後再試',
        confirmText: '我知道了',
      });
    }
  };

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar title="加盟商管理" />
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridWrapper}>
                {vendors.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.cardWrapper}
                    onPress={() => {
                      setVisibleMenuId(null);
                      navigation.navigate('AddVendor', {
                        vendor: item,
                      });
                    }}
                  >
                    <Image
                      source={require('@/assets/iot-logo-black.png')}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <View style={styles.cardActions}>
                        <Menu
                          visible={visibleMenuId === item.uid}
                          onDismiss={() => setVisibleMenuId(null)}
                          anchor={
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() =>
                                setVisibleMenuId(
                                  visibleMenuId === item.uid ? null : item.uid
                                )
                              }
                            >
                              <Icon
                                name="dots-vertical"
                                size={20}
                                color="#FFF"
                              />
                            </TouchableOpacity>
                          }
                          contentStyle={styles.menuStyle}
                        >
                          <Menu.Item
                            onPress={() => {
                              setVisibleMenuId(null);
                              navigation.navigate('AddVendor', {
                                vendor: item,
                              });
                            }}
                            title="編輯"
                            leadingIcon="pencil-outline"
                          />
                        </Menu>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addCardWrapper}
                  onPress={() => navigation.navigate('AddVendor')}
                >
                  <Image
                    source={require('@/assets/iot-logo-white.png')}
                    style={styles.cardImage}
                  />
                  <View style={styles.addCardFooter}>
                    <Text style={styles.addCardText}>新增店家</Text>
                    <View style={styles.addIconWrapper}>
                      <Icon name="plus" size={20} color="#FFF" />
                    </View>
                  </View>
                </TouchableOpacity>
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

export default VendorManagementScreen;
