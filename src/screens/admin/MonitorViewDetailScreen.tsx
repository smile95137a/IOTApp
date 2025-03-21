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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchAllStores, deleteStore, Store } from '@/api/admin/storeApi'; // 引入刪除 API
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';
import { getMonitorsByStoreId } from '@/api/admin/monitorApi';
import HeaderBar from '@/component/admin/HeaderBar';

const MonitorViewDetailScreen = () => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();
  const [monitors, setMonitors] = useState([]);

  const loadMonitors = async () => {
    try {
      dispatch(showLoading());
      const response = await getMonitorsByStoreId(storeId);
      dispatch(hideLoading());

      if (response.success) {
        const formattedData = response.data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          status: !!item.status,
        }));

        setMonitors(formattedData);
      } else {
        Alert.alert('錯誤', '無法獲取監視器列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '獲取監視器失敗');
    }
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMonitors(); // 當頁面獲取焦點時刷新數據
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <HeaderBar title="攝影機管理" />
          </View>
          <View style={styles.contentWrapper}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.headerContainer}>
                <Text style={styles.header}>攝影店家</Text>
              </View>

              {/* 店家列表 */}
              <FlatList
                data={[...monitors]}
                keyExtractor={(item) => item.uid}
                contentContainerStyle={styles.listContainer}
                windowSize={1}
                numColumns={2}
                renderItem={({ item }) => (
                  <TouchableOpacity key={item.uid} style={styles.card}>
                    <View style={styles.row}>
                      {/* 左側圖標 */}

                      <Image
                        source={require('@/assets/iot-camera-logo.png')}
                        style={styles.cardIcon}
                      />
                      {/* 右側信息 */}

                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                      </View>
                    </View>
                    <Image
                      source={require('@/assets/iot-m.jpg')}
                      style={styles.cameraImage}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
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
    height: 200,
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
  cameraImage: {
    flex: 1, // 让图片填充剩余空间
    width: '100%',
    resizeMode: 'cover', // 让图片铺满区域
  },
});

export default MonitorViewDetailScreen;
