import {
  PoolTable,
  fetchAllPoolTables,
  fetchPoolTablesByStoreId,
} from '@/api/admin/poolTableApi';
import HeaderBar from '@/component/admin/HeaderBar';
import Header from '@/component/Header';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 引入右箭頭圖標
import { useDispatch } from 'react-redux';

const DeviceTableManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const storeId = route.params?.storeId;
  const [poolTables, setPoolTables] = useState<PoolTable[]>([]);

  const loadPoolTables = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchPoolTablesByStoreId(
        storeId
      );
      dispatch(hideLoading());
      if (success) {
        setPoolTables(data);
      } else {
        Alert.alert('錯誤', message || '無法載入桌檯資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadPoolTables();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPoolTables(); // 當頁面獲取焦點時刷新數據
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-admin-bg.png')}
            resizeMode="contain" // Adjust to fit properly
          />
        </View>
        {/* Header */}
        <HeaderBar title="設備管理" />
        <View style={styles.mainContainer}>
          <View style={styles.gridContainer}>
            {poolTables.map((table, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('EnvironmentTableManagement', {
                    tableId: table.id,
                  })
                }
              >
                <View style={styles.row}>
                  {/* 圖標和桌台名稱在同一行 */}
                  <Image
                    source={require('@/assets/iot-home1.png')} // 替換為桌台圖標路徑
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{table.tableNumber}</Text>
                </View>
                {/* 設定按鈕 */}
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() =>
                    navigation.navigate('EnvironmentTableManagement', {
                      tableId: table.id,
                    })
                  }
                >
                  <Text style={styles.settingsButtonText}>設定</Text>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color="#FFF"
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    position: 'absolute', // Fix it to the block
    right: -200,
    bottom: 0,
    // Push it behind other content
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    opacity: 0.1, // Make it subtle as a background
  },
  fixedImage: {
    width: 400,
    height: 400,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#2C9252',
    width: '49%',
    height: 128,
    aspectRatio: 1.5,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10, // 圖標和桌台名稱間距
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
    backgroundColor: '#8FDC96',
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
});

export default DeviceTableManagementScreen;
