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
import { Vendor, fetchAllVendors, deleteVendor } from '@/api/admin/vendorApi'; // 加入刪除 API
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const VendorManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const navigation = useNavigation();

  const loadVendors = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllVendors();
      dispatch(hideLoading());
      if (success) {
        setVendors(data);
      } else {
        Alert.alert('錯誤', message || '無法載入資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert(
        '錯誤',
        error instanceof Error ? error.message : String(error)
      );
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

  // 刪除廠商
  const handleDelete = (vendorId, vendorName) => {
    Alert.alert('確認刪除', `確定要刪除廠商「${vendorName}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            console.log('AAAAAAAAAA', vendorId);

            const response = await deleteVendor(vendorId);
            dispatch(hideLoading());

            if (response.success) {
              Alert.alert('成功', '廠商已刪除');
              loadVendors(); // 重新載入列表
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
          <Text style={styles.header}>廠商管理</Text>
        </View>

        {/* 廠商列表 */}
        <FlatList
          data={[...vendors, { uid: 'addButton', isAddButton: true }]}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          windowSize={1}
          numColumns={2}
          renderItem={({ item }) =>
            item.isAddButton ? (
              <TouchableOpacity
                style={styles.addTableButton}
                onPress={() => navigation.navigate('AddVendor')}
              >
                <Image
                  source={require('@/assets/iot-login-logo.png')}
                  style={styles.tableIcon}
                />
                <Text style={styles.addTableText}>新增廠商 +</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity key={item.uid} style={styles.card}>
                <View style={styles.row}>
                  {/* 左側圖標 */}
                  <Image
                    source={require('@/assets/iot-login-logo.png')}
                    style={styles.cardIcon}
                  />

                  {/* 右側信息 */}

                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.contactInfo}</Text>
                  </View>
                </View>
                {/* 設定按鈕 */}
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() =>
                    navigation.navigate('AddVendor', { vendor: item })
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
                  <Text style={styles.deleteButtonText}>刪除</Text>
                  <Icon
                    name="delete"
                    size={20}
                    color="#f23857"
                    style={styles.deleteButtonIcon}
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

  vendorItem: {
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
  vendorInfoContainer: {
    flex: 1,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  vendorContact: {
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
  deleteButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f23857',
  },
  deleteButtonIcon: {
    marginLeft: 5, // 與文字保持距離
  },
});

export default VendorManagementScreen;
