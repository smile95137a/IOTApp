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
          <TouchableOpacity
            onPress={() => navigation.navigate('AddVendor')}
            style={styles.addButton}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 廠商列表 */}
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.vendorItem}>
              {/* 廠商資訊 */}
              <TouchableOpacity
                style={styles.vendorInfoContainer}
                onPress={() =>
                  navigation.navigate('AddVendor', { vendor: item })
                }
              >
                <View style={styles.vendorInfo}>
                  <Text style={styles.vendorName}>{item.name}</Text>
                  <Text style={styles.vendorContact}>{item.contactInfo}</Text>
                </View>
              </TouchableOpacity>

              {/* 編輯 & 刪除按鈕 */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddVendor', { vendor: item })
                  }
                  style={styles.iconButton}
                >
                  <Icon name="pencil" size={24} color="#007bff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.uid, item.name)}
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
});

export default VendorManagementScreen;
