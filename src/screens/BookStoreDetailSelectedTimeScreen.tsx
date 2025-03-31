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
import TimeSlotSelector from '@/component/book/TimeSlotSelector';
import { Alert } from 'react-native';
import { bookGame, getAvailableTimes } from '@/api/gameApi';
import { genRandom } from '@/utils/RandomUtils';

const BookStoreDetailSelectedDate = ({ route, navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const { store, tableItem, selectedDate } = route.params;
  const [tables, setTables] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [activeTimeSlot, setActiveTimeSlot] = useState<string | null>(null);

  const handleSelectSlot = (id: string) => {
    setActiveTimeSlot((prev) => (prev === id ? null : id)); // toggle 選取
  };
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentRegularSlot, setCurrentRegularSlot] = useState<any>(null);
  const [currentDiscountSlot, setCurrentDiscountSlot] = useState<any>(null);

  useEffect(() => {
    const loadTables = async () => {
      try {
        dispatch(showLoading());
        const { success, data } = await getAvailableTimes(
          store.id,
          selectedDate,
          tableItem.id
        );
        dispatch(hideLoading());

        if (success) {
          const slots =
            data[tableItem.id]?.map((x) => ({
              ...x,
              id: genRandom(32),
            })) || [];
          setTimeSlots(slots);
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
  const handleTimeSlotReservation = (start: string, end: string) => {
    Alert.alert(
      '預約桌台',
      `確認預約 ${store.name}\n桌台 ${tableItem.uid}\n${start}~${end}？`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確認預約',
          onPress: async () => {
            try {
              dispatch(showLoading());

              const { success, data, message } = await bookGame({
                poolTableUId: tableItem.uid,
                bookDate: selectedDate,
                startTime: moment(
                  `${selectedDate} ${start}`,
                  'YYYY-MM-DD HH:mm'
                ).format('YYYY/MM/DD HH:mm'),
                endTime: moment(
                  `${selectedDate} ${end}`,
                  'YYYY-MM-DD HH:mm'
                ).format('YYYY/MM/DD HH:mm'),
              });

              dispatch(hideLoading());

              if (success) {
                Alert.alert('預約成功', '您已成功預約桌台！', [
                  {
                    text: '知道了',
                    onPress: () => {
                      navigation.navigate('Explore', {
                        screen: 'BookStore',
                      });
                    },
                  },
                ]);
              } else {
                Alert.alert('預約失敗', message || '無法完成預約，請稍後再試');
              }
            } catch (error: any) {
              dispatch(hideLoading());

              const errMsg =
                error?.response?.data?.message ||
                error?.message ||
                '發生未知錯誤，請稍後再試';

              Alert.alert('錯誤', errMsg);
              console.log('預約發生錯誤:', error);
            }
          },
        },
      ]
    );
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

          <ScrollView style={styles.tablesSection}>
            {timeSlots.map((slot, index) => (
              <TimeSlotSelector
                key={index}
                start={slot.start}
                end={slot.end}
                rate={slot.rate}
                status={
                  slot.status === 'booked'
                    ? 'booked'
                    : activeTimeSlot === slot.id
                    ? 'selected'
                    : 'available'
                }
                onSelect={() => handleTimeSlotReservation(slot.start, slot.end)}
                onCancel={() => handleSelectSlot(slot.id)}
                onPress={() => handleSelectSlot(slot.id)}
              />
            ))}
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
