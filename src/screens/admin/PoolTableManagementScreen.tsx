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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  fetchAllPoolTables,
  deletePoolTable,
  PoolTable,
  fetchPoolTablesByStoreId,
} from '@/api/admin/poolTableApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import Header from '@/component/Header';
import HeaderBar from '@/component/admin/HeaderBar';

const PoolTableManagementScreen = () => {
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
      loadPoolTables();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-admin-bg.png')}
            resizeMode="contain"
          />
        </View>

        <View style={styles.header}>
          <HeaderBar title="桌檯管理" />
        </View>
        <View style={styles.mainContainer}>
          <ScrollView contentContainerStyle={styles.listContainer}>
            <View style={styles.tableGrid}>
              {poolTables.map((item) => (
                <TouchableOpacity
                  key={item.uid}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('AddPoolTable', {
                      poolTable: item,
                      storeId,
                    })
                  }
                >
                  <Image
                    source={require('@/assets/iot-table-enable.png')}
                    style={styles.cardImg}
                  />
                  <View style={styles.cardFooter}>
                    <Text style={styles.cardText}>{item.tableNumber}</Text>
                    <View style={styles.cardInfoRight}>
                      <Text style={styles.cardInfoRightText}>設定</Text>
                      <View style={styles.cardInfoRightIcon}>
                        <Icon name="chevron-right" size={20} color="#FFF" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.addTableButton}
                onPress={() => navigation.navigate('AddPoolTable', { storeId })}
              >
                <Image
                  source={require('@/assets/iot-table-enable.png')}
                  style={styles.addTableButtonImg}
                />
                <View style={styles.addTableButtonFooter}>
                  <Text style={styles.addTableButtonLeftText}>新增桌台</Text>
                  <View style={styles.addTableButtonRightIcon}>
                    <Icon name="plus" size={20} color="#FFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  },
  fixedImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    right: 0,
    bottom: 0,

    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },
  listContainer: {
    paddingBottom: 20,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    height: 128,
    borderRadius: 20,
    padding: 14,
    justifyContent: 'space-between',
    marginBottom: 8,
    marginHorizontal: '1%',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    flex: 1,
    objectFit: 'contain',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInfoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfoRightText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardInfoRightIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addTableButton: {
    backgroundColor: '#FFC702',
    width: '48%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  addTableButtonImg: {
    width: '100%',
    height: '100%',
    flex: 1,
    objectFit: 'contain',
  },
  addTableButtonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  addTableButtonLeftText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addTableButtonRightIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PoolTableManagementScreen;
