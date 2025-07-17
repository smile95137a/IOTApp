import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Share,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import { fetchPoolTablesByStoreUid } from '../api/poolTableAPI';
import NumberFormatter from '../component/NumberFormatter';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { AppDispatch } from '../store/store';
import { setSelectedStore } from '../store/storeSelectionSlice';
import { getErrorMessage } from '../utils/errorUtils';
import { getImageUrl } from '../utils/ImageUtils';
import { logJson } from '../utils/logJsonUtils';
import Header from '../component/Header';
import { fetchStoreByUid } from '../api/storeApi';
import { useNavigation, useRoute } from '@react-navigation/native';
import { startGame } from '../api/gameApi';
import { useDialog } from '../context/DialogContext';

const StoreDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const { store } = route.params;
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentRegularSlot, setCurrentRegularSlot] = useState<any>(null);
  const [currentDiscountSlot, setCurrentDiscountSlot] = useState<any>(null);

  useEffect(() => {
    const loadTables = async () => {
      try {
        dispatch(showLoading());
        const { success, data } = await fetchPoolTablesByStoreUid(store.uid);
        dispatch(hideLoading());

        if (success) {
          setTables(data);
        } else {
          console.log(`API 回應失敗: 未能獲取桌台數據`);
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    const loadData = async () => {
      try {
        dispatch(showLoading());

        const storeRes = await fetchStoreByUid(store.uid);
        const todayRes = storeRes.data.todayRes;
        if (todayRes) {
          const now = moment();
          const open = moment(todayRes.openTime, 'HH:mm');
          const close = moment(todayRes.closeTime, 'HH:mm');

          const inBusinessHours = now.isBetween(open, close, null, '[)');

          const currentSlot = todayRes.timeSlots.find((slot) => {
            const start = moment(slot.startTime, 'HH:mm');
            const end = moment(slot.endTime, 'HH:mm');
            return now.isBetween(start, end, null, '[)');
          });

          setTodayPricing({
            regularRate: todayRes.regularRate,
            discountRate: currentSlot?.regularRate ?? todayRes.regularRate,
          });

          setCurrentDiscountSlot(
            currentSlot
              ? {
                  startTime: currentSlot.startTime,
                  endTime: currentSlot.endTime,
                }
              : null
          );

          setCurrentRegularSlot(
            inBusinessHours
              ? {
                  startTime: todayRes.openTime,
                  endTime: todayRes.closeTime,
                }
              : null
          );
        }

        dispatch(hideLoading());
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadData();
    loadTables();
    dispatch(setSelectedStore(store));
  }, [store.uid]);

  const handleShare = async () => {
    try {
      dispatch(showLoading());
      const result = await Share.share({
        title: '店家資訊分享',
        message: `店鋪名稱：${store.name}\n地址：${store.address}\n聯絡電話：${store.contactPhone}\n快來看看`,
      });

      dispatch(hideLoading());

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('已透過指定應用程式分享: ', result.activityType);
        } else {
          console.log('分享成功');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('使用者取消分享');
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleCallPhone = async () => {
    const phoneNumber = `tel:${store?.contactPhone}`;

    try {
      dispatch(showLoading());

      const supported = await Linking.canOpenURL(phoneNumber);
      dispatch(hideLoading());
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.log('不支援撥打此電話:', phoneNumber);
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };
  const calculateTotalCost = (specialDate) => {
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const totalOpenMinutes =
      toMinutes(specialDate.closeTime) - toMinutes(specialDate.openTime);
    let discountMinutes = 0;
    let discountCost = 0;

    for (const slot of specialDate.timeSlots) {
      const duration = toMinutes(slot.endTime) - toMinutes(slot.startTime);
      discountMinutes += duration;
      discountCost += duration * slot.price;
    }

    const regularMinutes = totalOpenMinutes - discountMinutes;
    const regularCost = regularMinutes * specialDate.regularRate;
    const totalCost = discountCost + regularCost;

    return {
      totalCost,
      discountCost,
      regularCost,
      discountMinutes,
      regularMinutes,
      totalMinutes: totalOpenMinutes,
    };
  };

  const handleStartGame = async (poolTableUid: string) => {
    try {
      dispatch(showLoading());

      const payType = 'game';
      const result = await startGame({ poolTableUId: poolTableUid, payType });
      dispatch(hideLoading());
      if (result.success) {
        if (result.data) {
          await openInfoDialog({
            title: '系統訊息',
            content: '開局成功',
            confirmText: '我知道了',
          });
          (navigation as any).reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: result.message || '開局失敗，請稍後再試',
          });
        }
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: result.message || '開局失敗，請稍後再試',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    } finally {
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1D1640', '#4067A4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Header
            title={'門市資訊'}
            onBackPress={() => (navigation as any).goBack()}
            isDarkMode
          />

          {/* Store Details */}
          <View style={styles.storeDetails}>
            <Image src={getImageUrl(store?.imgUrl)} style={styles.storeImage} />
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeAddress}>{store.address}</Text>
            </View>
            <TouchableOpacity
              style={styles.storePhone}
              onPress={handleCallPhone}
            >
              <Feather name="volume-2" size={24} color="#00BFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.storeShare} onPress={handleShare}>
              <Icon name="share" size={24} color="#00BFFF" />
            </TouchableOpacity>
          </View>

          {/* Pricing Section */}
          {todayPricing && (
            <View style={styles.pricingContainer}>
              <View style={styles.pricingTitleContainer}>
                <Text style={styles.pricingTitle}>時段</Text>
                <Text style={styles.pricingTitle}>計費</Text>
              </View>
              <TouchableOpacity style={styles.pricingCard}>
                <Text style={styles.pricingAmount}>
                  <NumberFormatter number={todayPricing.regularRate * 60} />
                  元/小時
                </Text>
                <Text style={styles.pricingDetails}>一般時段</Text>
                <Text style={styles.pricingDetails}>
                  {currentRegularSlot ? (
                    <Text style={styles.pricingDetails}>
                      {currentRegularSlot.startTime} -
                      {currentRegularSlot.endTime}
                    </Text>
                  ) : (
                    <Text style={styles.pricingDetails}>目前不在一般時段</Text>
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pricingCard}>
                <Text style={styles.pricingAmount}>
                  <NumberFormatter number={todayPricing.discountRate * 60} />
                  元/小時
                </Text>
                <Text style={styles.pricingDetails}>優惠時段</Text>
                <Text style={styles.pricingDetails}>
                  {currentDiscountSlot ? (
                    <Text style={styles.pricingDetails}>
                      {currentDiscountSlot.startTime} -
                      {currentDiscountSlot.endTime}
                    </Text>
                  ) : (
                    <Text style={styles.pricingDetails}>目前不在優惠時段</Text>
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tables */}
          <View style={styles.tablesSection}>
            <View style={styles.tablesHeader}>
              <Text style={styles.tablesTitle}>桌數：{tables.length}桌</Text>
              <Text style={styles.tablesAvailable}>
                可用：{tables.filter((table) => !table.isUse).length}桌
              </Text>
            </View>

            {/* 使用 map 直接渲染桌台列表 */}
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.tableGrid}>
                {tables.map((item) => {
                  const isReserved = item.isUse;
                  const isFault =
                    item.status === 'FAULT' || item.status === 'UNAVAILABLE';

                  const status = isFault
                    ? 'fault'
                    : isReserved
                    ? 'reserved'
                    : 'available';
                  const label = isFault
                    ? '設備維護中'
                    : isReserved
                    ? '開局進行中'
                    : '立即開台';
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.tableItem}
                      disabled={status !== 'available'}
                      onPress={() => handleStartGame(item.uid)}
                    >
                      <Image
                        source={
                          status === 'available'
                            ? require('../assets/iot-table-enable.png')
                            : require('../assets/iot-table-disable.png')
                        }
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
                          <Text
                            style={[
                              styles.tableTextContainerId,
                              status !== 'available' && { color: 'white' },
                            ]}
                          >
                            {item.tableNumber.toString()}
                          </Text>

                          <Text
                            style={[
                              styles.tableTextContainerText,
                              status !== 'available' && { color: 'white' },
                            ]}
                          >
                            {label}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  storeDetails: {
    flexDirection: 'row',
    marginHorizontal: 20,
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
  storePhone: { marginRight: 12 },
  storeShare: {},
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BFFF',
  },
  storeAddress: {
    fontSize: 12,
    color: '#00BFFF',
    marginTop: 5,
  },
  scrollContainer: {
    flexGrow: 1, // 讓內容可以滾動
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
    justifyContent: 'center',
    marginBottom: 15,
  },
  tablesTitle: {
    fontSize: 16,
    color: '#333',
  },
  tablesAvailable: {
    fontSize: 16,
    color: '#3946FF',
    marginLeft: 12,
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tableItem: {
    width: '48%', // 讓兩個 item 並排
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
    backgroundColor: '#FFC702', // 背景颜色
    paddingVertical: 8, // 垂直内边距
    paddingHorizontal: 12, // 水平内边距
    borderRadius: 20, // 圆角
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
    marginRight: 5, // ID 和文字之间的间距
  },
  tableTextContainerText: {
    fontSize: 14, // 字体大小
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
    paddingVertical: 10,
  },
  pricingCard: {
    flex: 1,
    padding: 12,
    paddingVertical: 4,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#FFF',
  },
  pricingTitleContainer: {
    width: 70,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingTitle: {
    fontSize: 14,
    color: '#fff',
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
