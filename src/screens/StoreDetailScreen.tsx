import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { fetchPoolTablesByStoreUid, PoolTable } from '@/api/poolTableAPI';
import Header from '@/component/Header';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import NumberFormatter from '@/component/NumberFormatter';

const StoreDetailScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const { store } = route.params;
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    const loadTables = async () => {
      try {
        dispatch(showLoading());
        const { success, data } = await fetchPoolTablesByStoreUid(store.uid);
        dispatch(hideLoading());

        if (success) {
          setTables(data);
        } else {
          console.error(`API 回應失敗: 未能獲取桌台數據`);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error('Failed to fetch pool tables:', error);
      }
    };

    loadTables();
  }, [store.uid]);

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `店铺名称: ${store.name}\n地址: ${store.address}\n快来看看吧！`,
        url: 'https://example.com',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing: ', error);
    }
  };

  const renderTableItem = ({ item }: { item: PoolTable }) => {
    const status = item.isUse ? 'reserved' : 'available';
    const label = item.isUse ? '已預訂' : '立即開台';

    return (
      <TouchableOpacity
        style={[styles.tableItem]}
        disabled={status === 'reserved'}
        onPress={() => {
          if (status === 'available') {
            navigation.navigate('Member', {
              screen: 'Reservation',
              params: { tableUid: item.uid }, // 傳遞桌檯 UID
            });
          }
        }}
      >
        <Image
          source={require('@/assets/iot-table.png')}
          style={[
            styles.tableImage,
            status === 'available'
              ? styles.tableImageAvailable
              : styles.tableImageReserved,
          ]}
        />
        <View
          style={[
            styles.tableTextContainer,
            status === 'available'
              ? styles.tableTextContainerAvailable
              : styles.tableTextContainerReserved,
          ]}
        >
          <View style={styles.tableTextContainerRow}>
            <Text style={styles.tableTextContainerId}>
              {item.tableNumber.toString()}
            </Text>

            <Text style={styles.tableTextContainerText}>
              {status === 'available' ? label : label}
            </Text>
          </View>
          {status === 'available' && (
            <Icon
              name="chevron-right"
              size={16}
              color="#fff"
              style={styles.tableTextContainerIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={store.name}
        onBackPress={() => navigation.goBack()}
        rightIcon="more-vert"
        onRightPress={() => console.log('More options pressed')}
        isDarkMode
      />

      {/* Store Details */}
      <View style={styles.storeDetails}>
        <Image
          source={require('@/assets/iot-login-logo.png')}
          style={styles.storeImage}
        />
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.name}</Text>
          <Text style={styles.storeAddress}>{store.address}</Text>
        </View>
        <TouchableOpacity style={styles.storeShare} onPress={handleShare}>
          <Icon name="share" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Pricing Section */}
      <View style={styles.pricingContainer}>
        <View style={styles.pricingTitleContainer}>
          <Text style={styles.pricingTitle}>時段</Text>
          <Text style={styles.pricingTitle}>計費</Text>
        </View>
        <TouchableOpacity style={styles.pricingCard}>
          <Text style={styles.pricingAmount}>
            <NumberFormatter number={store.regularRate} />
            元/小時
          </Text>
          <Text style={styles.pricingDetails}>一般時段</Text>
          <Text style={styles.pricingDetails}>
            {' '}
            {store.regularDateRange}
            {store.regularTimeRange}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pricingCard}>
          <Text style={styles.pricingAmount}>
            <NumberFormatter number={store.discountRate} />
            元/小時
          </Text>
          <Text style={styles.pricingDetails}>優惠時段</Text>
          <Text style={styles.pricingDetails}>
            {store.discountDateRange}
            {store.discountTimeRange}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tables */}
      <View style={styles.tablesSection}>
        <View style={styles.tablesHeader}>
          <Text style={styles.tablesTitle}>台桌數：{tables.length} 台</Text>
          <Text style={styles.tablesAvailable}>
            目前可用：{tables.filter((table) => !table.isUse).length} 台
          </Text>
        </View>
        <FlatList
          windowSize={10}
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.tableRow}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },

  storeDetails: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  storeImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeShare: {},
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  storeAddress: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  tablesSection: {
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  tablesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tablesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tablesAvailable: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F67943',
  },
  tableRow: {
    justifyContent: 'space-between',
  },
  tableItem: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  tableImage: {
    width: '100%',
    height: 126,
    resizeMode: 'contain',
  },
  tableImageAvailable: {},
  tableImageReserved: {
    opacity: 0.5,
  },
  tableTextContainer: {
    flexDirection: 'row', // 横向布局
    alignItems: 'center', // 垂直居中
    justifyContent: 'space-between', // 左右两边均匀分布
    backgroundColor: '#F67943', // 背景颜色
    paddingVertical: 8, // 垂直内边距
    paddingHorizontal: 12, // 水平内边距
    borderRadius: 9, // 圆角
  },
  tableTextContainerAvailable: {},
  tableTextContainerReserved: {
    backgroundColor: '#8A9493', // 背景颜色
  },
  tableTextContainerRow: {
    flexDirection: 'row', // ID 和文字横向排列
    alignItems: 'center', // 垂直居中
  },
  tableTextContainerId: {
    fontSize: 14, // 字体大小
    fontWeight: 'bold', // 加粗字体
    color: '#fff', // 字体颜色
    marginRight: 5, // ID 和文字之间的间距
  },
  tableTextContainerText: {
    fontSize: 14, // 字体大小
    color: '#fff', // 字体颜色
  },
  tableTextContainerIcon: {
    marginLeft: 8, // 图标和文字之间的间距
  },

  pricingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  pricingCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  pricingTitleContainer: {
    width: 70,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingTitle: {
    fontSize: 14,
    color: '#555',
  },
  pricingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  pricingDetails: {
    fontSize: 12,
    color: '#fff',
  },
});

export default StoreDetailScreen;
