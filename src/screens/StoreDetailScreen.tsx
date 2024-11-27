import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const tableData = [
  { id: 'A1', status: 'available', label: '立即開台' },
  { id: 'A2', status: 'available', label: '立即開台' },
  { id: 'A3', status: 'reserved', label: '剩餘 1小時12分' },
  { id: 'A4', status: 'available', label: '立即開台' },
];

const StoreDetailScreen = ({ route, navigation }: any) => {
  const { store } = route.params;

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

  const renderTableItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.tableItem]}
      disabled={item.status === 'reserved'}
    >
      <Image
        source={require('@/assets/iot-table.png')}
        style={[
          styles.tableImage,
          item.status === 'available'
            ? styles.tableImageAvailable
            : styles.tableImageReserved,
        ]}
      />
      <View
        style={[
          styles.tableTextContainer,
          item.status === 'available'
            ? styles.tableTextContainerAvailable
            : styles.tableTextContainerReserved,
        ]}
      >
        <View style={styles.tableTextContainerRow}>
          <Text style={styles.tableTextContainerId}>{item.id}</Text>
          <Text style={styles.tableTextContainerText}>
            {item.status === 'available' ? item.label : item.label}
          </Text>
        </View>
        {item.status === 'available' && (
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

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={store.name}
        onBackPress={() => navigation.goBack()}
        rightIcon="more-vert"
        onRightPress={() => console.log('More options pressed')}
        titleColor="#FFF"
        iconColor="#FFF"
      />

      {/* Store Details */}
      <View style={styles.storeDetails}>
        <Image
          source={{ uri: 'https://via.placeholder.com/200x100.png?text=Store' }}
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
          <Text style={styles.pricingAmount}>100元/小時</Text>
          <Text style={styles.pricingDetails}>一般時段</Text>
          <Text style={styles.pricingDetails}>週一～日18:00~02:00</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pricingCard}>
          <Text style={styles.pricingAmount}>60元/小時</Text>
          <Text style={styles.pricingDetails}>優惠時段</Text>
          <Text style={styles.pricingDetails}>週一～五08:00~18:00</Text>
        </TouchableOpacity>
      </View>

      {/* Tables */}
      <View style={styles.tablesSection}>
        <View style={styles.tablesHeader}>
          <Text style={styles.tablesTitle}>台桌數：10台</Text>
          <Text style={styles.tablesAvailable}>目前可用：5台</Text>
        </View>
        <FlatList
          data={tableData}
          renderItem={renderTableItem}
          keyExtractor={(item) => item.id}
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
    borderRadius: 10,
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
