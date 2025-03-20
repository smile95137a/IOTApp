import React, { useEffect, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
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

const StoreManagementScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [stores, setStores] = useState([]);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const vendor = route.params?.vendor;

  const loadStores = async () => {
    try {
      dispatch(showLoading());
      const response = vendor
        ? await fetchStoresByVendorId(vendor.id)
        : await fetchAllStores();
      dispatch(hideLoading());

      if (response.success) {
        setStores(response.data);
      } else {
        Alert.alert('錯誤', response.message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadStores();
  }, [vendor]);

  const handleDelete = (storeUid, storeName) => {
    Alert.alert('確認刪除', `確定要刪除店家「${storeName}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const response = await deleteStore(storeUid);
            dispatch(hideLoading());

            if (response.success) {
              Alert.alert('成功', '店家已刪除');
              loadStores();
            } else {
              Alert.alert('錯誤', response.message || '刪除失敗');
            }
          } catch (error) {
            dispatch(hideLoading());
            Alert.alert('錯誤', '刪除失敗，請稍後再試');
          }
        },
      },
    ]);
  };

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-threeBall.png')}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <Header title="店家管理" onBackPress={() => navigation.goBack()} />
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridWrapper}>
                {stores.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.cardWrapper}
                    onPress={() =>
                      navigation.navigate('AddStore', { store: item })
                    }
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
                            onPress={() =>
                              navigation.navigate('AddStore', { store: item })
                            }
                            title="編輯"
                            leadingIcon="pencil-outline"
                          />
                          <Menu.Item
                            onPress={() => handleDelete(item.uid, item.name)}
                            title="刪除"
                            leadingIcon="trash-can-outline"
                            titleStyle={{ color: 'red' }}
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
    right: -200,
    bottom: 0,
    opacity: 0.1,
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
    backgroundColor: '#FFD700',
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
