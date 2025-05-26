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
import { useDispatch } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';

import { useSelector } from 'react-redux';
import { fetchStoreListByUserId, deleteStore } from '../../api/admin/storeApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch, RootState } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const StoreManagementScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const vendor = route.params?.vendor;
  const isSuperAdmin = user.user?.roles?.some((role) => role.id === 1);

  const { openInfoDialog, openConfirmDialog } = useDialog();

  const loadStores = async () => {
    try {
      dispatch(showLoading());

      const userId = user?.user?.id;
      if (!userId) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: '使用者資訊取得失敗，無法載入店家列表',
          confirmText: '我知道了',
        });
        return;
      }

      const response = await fetchStoreListByUserId(userId);
      dispatch(hideLoading());

      if (response.success) {
        setStores(response.data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '無法載入店家資訊',
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
  }, [vendor]);

  useFocusEffect(
    useCallback(() => {
      loadStores();
    }, [])
  );

  const handleDelete = async (storeUid, storeName) => {
    const confirmed = await openConfirmDialog({
      title: '確認刪除',
      content: `確定要刪除店家「${storeName}」嗎？`,
      confirmText: '刪除',
      cancelText: '取消',
    });

    if (!confirmed) return;

    try {
      dispatch(showLoading());
      const response = await deleteStore(storeUid);
      dispatch(hideLoading());

      if (response.success) {
        await openInfoDialog({
          title: '成功',
          content: '店家已刪除',
          confirmText: '我知道了',
        });
        loadStores();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '刪除失敗',
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
            <HeaderBar title="店家管理" showLeftButton />
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridWrapper}>
                {stores.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.cardWrapper}
                    onPress={() =>
                      (navigation as any).navigate('AddStore', { store: item })
                    }
                  >
                    <Image
                      source={require('../../assets/i-Pool_logo_RGB_1.png')}
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
                          {isSuperAdmin && (
                            <>
                              <Menu.Item
                                onPress={() =>
                                  (navigation as any).navigate('AddStore', {
                                    store: item,
                                  })
                                }
                                title="編輯"
                                leadingIcon="pencil-outline"
                              />
                              <Menu.Item
                                onPress={() =>
                                  handleDelete(item.uid, item.name)
                                }
                                title="刪除"
                                leadingIcon="trash-can-outline"
                                titleStyle={{ color: 'red' }}
                              />
                            </>
                          )}
                        </Menu>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {isSuperAdmin && (
                  <TouchableOpacity
                    style={styles.addCardWrapper}
                    onPress={() => (navigation as any).navigate('AddStore')}
                  >
                    <Image
                      source={require('../../assets/iot-logo-white.png')}
                      style={styles.cardImage}
                    />
                    <View style={styles.addCardFooter}>
                      <Text style={styles.addCardText}>新增店家</Text>
                      <View style={styles.addIconWrapper}>
                        <Icon name="plus" size={20} color="#FFF" />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
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

export default StoreManagementScreen;
