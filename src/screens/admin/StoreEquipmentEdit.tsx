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
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const StoreEquipmentEdit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const { store } = route.params; // 接收店家資訊
  const [equipments, setEquipments] = useState<Equipment[]>([]);

  // 加載設備列表
  const loadEquipments = async () => {
    // try {
    //   dispatch(showLoading());
    //   const { success, data, message } = await fetchStoreEquipments(store.uid);
    //   dispatch(hideLoading());
    //   if (success) {
    //     setEquipments(data);
    //   } else {
    //     Alert.alert('錯誤', message || '無法載入設備資訊');
    //   }
    // } catch (error) {
    //   dispatch(hideLoading());
    //   Alert.alert('錯誤', '發生錯誤，請稍後再試');
    // }
  };

  useEffect(() => {
    loadEquipments();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEquipments();
    }, [])
  );

  // 刪除設備
  const handleDelete = (equipmentUid: string, equipmentName: string) => {
    // Alert.alert('確認刪除', `確定要刪除設備「${equipmentName}」嗎？`, [
    //   { text: '取消', style: 'cancel' },
    //   {
    //     text: '刪除',
    //     style: 'destructive',
    //     onPress: async () => {
    //       try {
    //         dispatch(showLoading());
    //         const response = await deleteEquipment(equipmentUid);
    //         dispatch(hideLoading());
    //         if (response.success) {
    //           Alert.alert('成功', '設備已刪除');
    //           loadEquipments();
    //         } else {
    //           Alert.alert('錯誤', response.message || '刪除失敗');
    //         }
    //       } catch (error) {
    //         dispatch(hideLoading());
    //         Alert.alert('錯誤', '刪除失敗，請稍後再試');
    //       }
    //     },
    //   },
    // ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{store.name} - 設備管理</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddEquipment', { store })}
            style={styles.addButton}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 設備列表 */}
        <FlatList
          data={equipments}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.equipmentItem}>
              {/* 設備資訊 */}
              <TouchableOpacity
                style={styles.equipmentInfoContainer}
                onPress={() =>
                  navigation.navigate('AddEquipment', {
                    store,
                    equipment: item,
                  })
                }
              >
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentName}>{item.name}</Text>
                  <Text style={styles.equipmentDetails}>{item.details}</Text>
                </View>
              </TouchableOpacity>

              {/* 編輯 & 刪除按鈕 */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddEquipment', {
                      store,
                      equipment: item,
                    })
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
    fontSize: 20,
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
  equipmentItem: {
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
  equipmentInfoContainer: {
    flex: 1,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  equipmentDetails: {
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

export default StoreEquipmentEdit;
