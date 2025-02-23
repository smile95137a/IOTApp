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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchAllPoolTables,
  deletePoolTable,
  PoolTable,
} from '@/api/admin/poolTableApi'; // 引入刪除 API
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const PoolTableManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [poolTables, setPoolTables] = useState<PoolTable[]>([]);

  const loadPoolTables = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllPoolTables();
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

  // 刪除桌檯
  const handleDelete = (poolTableUid, tableNumber) => {
    Alert.alert('確認刪除', `確定要刪除桌檯「${tableNumber}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const response = await deletePoolTable(poolTableUid);
            dispatch(hideLoading());

            if (response.success) {
              Alert.alert('成功', '桌檯已刪除');
              loadPoolTables(); // 重新載入列表
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
          <Text style={styles.header}>桌檯管理</Text>
        </View>

        {/* 桌檯列表 */}
        <FlatList
          data={[...poolTables, { uid: 'addButton', isAddButton: true }]}
          keyExtractor={(item) => item.uid.toString()}
          contentContainerStyle={styles.listContainer}
          windowSize={1}
          numColumns={2}
          renderItem={({ item }) =>
            item.isAddButton ? (
              <TouchableOpacity
                style={styles.addTableButton}
                onPress={() => navigation.navigate('AddPoolTable')}
              >
                <Image
                  source={require('@/assets/iot-home1.png')}
                  style={styles.tableIcon}
                />
                <Text style={styles.addTableText}>新增桌台 +</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={item.uid}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('AddPoolTable', { poolTable: item })
                }
              >
                <View style={styles.row}>
                  {/* 圖標和桌台名稱在同一行 */}
                  <Image
                    source={require('@/assets/iot-home1.png')} // 替換為桌台圖標路徑
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{item.tableNumber}</Text>
                </View>
                {/* 設定按鈕 */}
                <TouchableOpacity style={styles.settingsButton}>
                  <Text style={styles.settingsButtonText}>設定</Text>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color="#FFF"
                    style={styles.arrowIcon}
                  />
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
  poolTableItem: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  poolTableInfoContainer: {
    flex: 1,
  },
  poolTableInfo: {
    flex: 1,
  },
  poolTableName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  poolTableStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  statusAvailable: {
    color: 'green',
  },
  statusUnavailable: {
    color: 'red',
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
  card: {
    backgroundColor: '#2C9252',
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
});

export default PoolTableManagementScreen;
