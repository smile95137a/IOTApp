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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Vendor, fetchAllVendors, deleteVendor } from '@/api/admin/vendorApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';
import Header from '@/component/Header';

const VendorManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const navigation = useNavigation();
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

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

  const handleDelete = (uid, vendorName) => {
    Alert.alert('確認刪除', `確定要刪除廠商「${vendorName}」嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const response = await deleteVendor(uid);
            dispatch(hideLoading());

            if (response.success) {
              Alert.alert('成功', '廠商已刪除');
              loadVendors();
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
          <View style={styles.backgroundImageContainer}>
            <Image
              source={require('@/assets/iot-threeBall.png')}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerContainer}>
            <Header title="廠商管理" onBackPress={() => navigation.goBack()} />
          </View>

          <View style={styles.contentContainer}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.vendorGrid}>
                {vendors.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.vendorCard}
                    onPress={() =>
                      navigation.navigate('StoreManagementStack', {
                        screen: 'StoreManagement',
                        params: { vendor: item }, // 若有要傳資料
                      })
                    }
                  >
                    <Image
                      source={require('@/assets/iot-logo-black.png')}
                      style={styles.vendorImage}
                    />
                    <View style={styles.vendorFooter}>
                      <Text style={styles.vendorName}>{item.name}</Text>
                      <View style={styles.vendorActions}>
                        <Menu
                          visible={visibleMenuId === item.uid}
                          onDismiss={() => setVisibleMenuId(null)}
                          anchor={
                            <TouchableOpacity
                              style={styles.actionIconButton}
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
                            onPress={() => {
                              setVisibleMenuId(null);
                              navigation.navigate('AddVendor', {
                                vendor: item,
                              });
                            }}
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
                  style={styles.addVendorButton}
                  onPress={() => navigation.navigate('AddVendor')}
                >
                  <Image
                    source={require('@/assets/iot-logo-white.png')}
                    style={styles.addVendorImage}
                  />
                  <View style={styles.addVendorFooter}>
                    <Text style={styles.addVendorText}>新增廠商</Text>
                    <View style={styles.addVendorIcon}>
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
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  backgroundImageContainer: {
    position: 'absolute',
    right: -200,
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  vendorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vendorCard: {
    backgroundColor: '#fff',
    width: '48%',
    height: 128,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: '1%',
  },
  vendorImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    objectFit: 'contain',
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vendorActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addVendorButton: {
    backgroundColor: '#FFD700',
    width: '48%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  addVendorImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    objectFit: 'contain',
  },
  addVendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  addVendorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addVendorIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuStyle: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 4,
  },
});

export default VendorManagementScreen;
