import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchAllStores,
  deleteStore,
  Store,
  fetchStoresByVendorId,
} from '@/api/admin/storeApi'; // 引入刪除 API
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';

const StoreManagementScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [stores, setStores] = useState<Store[]>([]);

  const vendor = route.params?.vendor;

  const loadStores = async () => {
    try {
      dispatch(showLoading());

      let response;

      if (vendor) {
        console.log('Fetching stores for vendor:', vendor.id);
        response = await fetchStoresByVendorId(vendor.id); // 呼叫特定供應商的 API
      } else {
        console.log('Fetching all stores');
        response = await fetchAllStores(); // 呼叫所有店家的 API
      }

      dispatch(hideLoading());

      const { success, data, message } = response;

      if (success) {
        setStores(data);
        console.log('Fetched stores:', data);
      } else {
        Alert.alert('錯誤', message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error loading stores:', error);
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };
  useEffect(() => {
    if (vendor) {
      console.log('Vendor updated:', vendor);
      loadStores();
    } else {
      loadStores();
    }
  }, [vendor]);

  // 刪除店家
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
              loadStores(); // 重新載入列表
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>店家管理</Text>
        </View>

        {/* 店家列表 */}
        <FlatList
          data={[...stores, { uid: 'addButton', isAddButton: true }]}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          windowSize={1}
          numColumns={2}
          renderItem={({ item }) =>
            item.isAddButton ? (
              <TouchableOpacity
                style={styles.addTableButton}
                onPress={() => navigation.navigate('AddStore')}
              >
                <Image
                  source={require('@/assets/iot-login-logo.png')}
                  style={styles.tableIcon}
                />
                <Text style={styles.addTableText}>新增店家 +</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={item.uid} style={styles.card}>
                <View style={styles.row}>
                  {/* 左側圖標 */}

                  <Image
                    source={
                      item?.imgUrl
                        ? { uri: getImageUrl(item.imgUrl) }
                        : require('@/assets/iot-user-logo.jpg')
                    }
                    style={styles.cardIcon}
                  />
                  {/* 右側信息 */}

                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.address}</Text>
                  </View>
                </View>
                {/* 設定按鈕 */}
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() =>
                    navigation.navigate('AddStore', { store: item })
                  }
                >
                  <Text style={styles.settingsButtonText}>編輯</Text>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color="#FFF"
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.uid, item.name)}
                >
                  <Icon name="delete" size={20} color="#dc3545" />
                </TouchableOpacity>
              </TouchableOpacity>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
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
  addButton: {
    backgroundColor: '#007bff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  storeItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  storeInfoContainer: {
    flex: 1,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10, // 圖標和桌台名稱間距
    borderRadius: '50%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // 將按鈕內容靠右
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  arrowIcon: {
    marginLeft: 5, // 與文字保持距離
  },
  addTableButton: {
    backgroundColor: '#c7dbee',
    width: '49%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tableIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  addTableText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#4787C7',
    width: '48%',
    height: 128,
    aspectRatio: 1.5,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: '1%',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#DDD',
    marginTop: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // 將按鈕內容靠右
  },
});

export default StoreManagementScreen;
