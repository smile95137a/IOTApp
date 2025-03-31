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
import { fetchPoolTablesByStoreUid } from '@/api/poolTableAPI';
import Header from '@/component/Header';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import NumberFormatter from '@/component/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Feather from '@expo/vector-icons/Feather';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['zh-tw'] = {
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  monthNamesShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  dayNames: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
  today: '今天',
};

LocaleConfig.defaultLocale = 'zh-tw';

const BookStoreDetailSelectedDate = ({ route, navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD')
  );
  const { store, tableItem } = route.params;
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
      } catch (error) {
        dispatch(hideLoading());
        console.log('Failed to fetch pool tables:', error);
      }
    };
    const getTodayPricing = () => {
      const today = moment().format('dddd').toUpperCase();
      const todaySchedule = store.pricingSchedules.find(
        (schedule: any) => schedule.dayOfWeek === today
      );

      if (!todaySchedule) return;
      setTodayPricing(todaySchedule);

      const now = moment();

      const discountSlot = todaySchedule.discountTimeSlots.find((slot: any) => {
        const start = moment(slot.startTime, 'HH:mm');
        const end = moment(slot.endTime, 'HH:mm');
        return now.isBetween(start, end);
      });
      const regularSlot = todaySchedule.regularTimeSlots.find((slot: any) => {
        const start = moment(slot.startTime, 'HH:mm');
        const end = moment(slot.endTime, 'HH:mm');
        return now.isBetween(start, end);
      });

      setCurrentDiscountSlot(discountSlot || null);
      setCurrentRegularSlot(regularSlot || null);
    };

    loadTables();
    getTodayPricing();
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
      console.log('Error sharing: ', error);
    }
  };

  const handleCallPhone = async () => {
    const phoneNumber = `tel:${store?.contactPhone}`;

    try {
      dispatch(showLoading());

      const supported = await Linking.canOpenURL(phoneNumber);
      if (supported) {
        await Linking.openURL(phoneNumber);
      } else {
        console.log('不支援撥打此電話:', phoneNumber);
      }
    } catch (err) {
      console.log('發生錯誤:', err);
    } finally {
      dispatch(hideLoading());
    }
  };
  //

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
            title={'預約開台'}
            onBackPress={() => navigation.goBack()}
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
                  <NumberFormatter number={~~todayPricing.regularRate} />
                  元/小時
                </Text>
                <Text style={styles.pricingDetails}>一般時段</Text>
                <Text style={styles.pricingDetails}>
                  {currentRegularSlot ? (
                    <Text style={styles.pricingDetails}>
                      目前時段：{currentRegularSlot.startTime} -{' '}
                      {currentRegularSlot.endTime}
                    </Text>
                  ) : (
                    <Text style={styles.pricingDetails}>目前不在一般時段</Text>
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pricingCard}>
                <Text style={styles.pricingAmount}>
                  <NumberFormatter number={~~todayPricing.discountRate} />
                  元/小時
                </Text>
                <Text style={styles.pricingDetails}>優惠時段</Text>
                <Text style={styles.pricingDetails}>
                  {currentDiscountSlot ? (
                    <Text style={styles.pricingDetails}>
                      目前時段：{currentDiscountSlot.startTime} -{' '}
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
          <ScrollView style={styles.tablesSection}>
            <View
              style={{
                paddingHorizontal: 16,
                backgroundColor: '#fff',
                borderRadius: 20,
                marginTop: 16,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  marginVertical: 12,
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                選擇日期
              </Text>
              <Calendar
                current={selectedDate}
                minDate={moment().format('YYYY-MM-DD')}
                onDayPress={(day) => {
                  navigation.navigate('BookStoreDetailSelectedTime', {
                    tableItem,
                    store,
                    selectedDate: day.dateString,
                  });
                }}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    selectedColor: '#F79540',
                    selectedTextColor: '#fff',
                  },
                }}
                theme={{
                  todayTextColor: '#3946FF',
                  textDayFontWeight: '500',
                  textMonthFontWeight: 'bold',
                  textDayHeaderFontWeight: '500',
                  arrowColor: '#3946FF',
                  monthTextColor: '#000',
                }}
              />
            </View>
          </ScrollView>
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

export default BookStoreDetailSelectedDate;
