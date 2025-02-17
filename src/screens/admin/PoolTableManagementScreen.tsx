import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
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
          <TouchableOpacity
            onPress={() => navigation.navigate('AddPoolTable')}
            style={styles.addButton}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 桌檯列表 */}
        <FlatList
          data={poolTables}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.poolTableItem}>
              {/* 桌檯資訊 */}
              <TouchableOpacity
                style={styles.poolTableInfoContainer}
                onPress={() =>
                  navigation.navigate('AddPoolTable', { poolTable: item })
                }
              >
                <View style={styles.poolTableInfo}>
                  <Text style={styles.poolTableName}>
                    桌檯號碼: {item.tableNumber}
                  </Text>
                  <Text
                    style={[
                      styles.poolTableStatus,
                      item.status === '可用'
                        ? styles.statusAvailable
                        : styles.statusUnavailable,
                    ]}
                  >
                    狀態: {item.status}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* 編輯 & 刪除按鈕 */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddPoolTable', { poolTable: item })
                  }
                  style={styles.iconButton}
                >
                  <Icon name="pencil" size={24} color="#007bff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.uid, item.tableNumber)}
                  style={styles.iconButton}
                >
                  <Icon name="trash-can-outline" size={24} color="#dc3545" />
                </TouchableOpacity>
              </View>
            </View>
          )}
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
});

export default PoolTableManagementScreen;
