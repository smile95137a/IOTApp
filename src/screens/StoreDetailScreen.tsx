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
  const { store } = route.params; // 从 navigation 传递的参数中获取门市数据

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `店铺名称: ${store.name}\n地址: ${store.address}\n快来看看吧！`,
        url: 'https://example.com', // 可以替换为实际店铺链接
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
    padding: 20,
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
  storePricing: {
    alignItems: 'flex-end',
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pricingDetail: {
    fontSize: 12,
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
});

export default StoreDetailScreen;
