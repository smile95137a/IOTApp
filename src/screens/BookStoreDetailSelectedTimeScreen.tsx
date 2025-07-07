import { LinearGradient } from 'expo-linear-gradient';
import moment from 'moment';
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
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { checkIsUse, getAvailableTimes } from '../api/gameApi';
import TimeSlotSelector from '../component/book/TimeSlotSelector';
import NumberFormatter from '../component/NumberFormatter';
import { useDialog } from '../context/DialogContext';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { AppDispatch } from '../store/store';
import { getErrorMessage } from '../utils/errorUtils';
import { getImageUrl } from '../utils/ImageUtils';
import { genRandom } from '../utils/RandomUtils';
import Header from '../component/Header';
import { fetchStoreByUid } from '../api/storeApi';
import { logJson } from '../utils/logJsonUtils';

const BookStoreDetailSelectedDate = ({ route, navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const { store, tableItem, selectedDate } = route.params;
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const [tables, setTables] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [activeTimeSlots, setActiveTimeSlots] = useState<string[]>([]);

  const handleSelectSlot = (id: string) => {
    setActiveTimeSlots((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentRegularSlot, setCurrentRegularSlot] = useState<any>(null);
  const [currentDiscountSlot, setCurrentDiscountSlot] = useState<any>(null);

  useEffect(() => {
    const loadTimes = async () => {
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
              rate: x.rate * 60,
            })) || [];
          logJson('asd', slots);
          setTimeSlots(slots);
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

          const currentSlot = todayRes.timeSlots[0];

          setTodayPricing({
            regularRate: todayRes.regularRate,
            discountRate: currentSlot?.regularRate ?? todayRes.regularRate,
          });

          setCurrentDiscountSlot({
            startTime: currentSlot.startTime,
            endTime: currentSlot.endTime,
          });

          setCurrentRegularSlot({
            startTime: todayRes.openTime,
            endTime: todayRes.closeTime,
          });
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

    loadTimes();
  }, [store.uid]);

  const handleShare = async () => {
    try {
      dispatch(showLoading());
      const result = await Share.share({
        message: `店铺名称: ${store.name}\n地址: ${store.address}\n快来看看吧！`,
        url: 'https://example.com',
      });
      dispatch(hideLoading());
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type: ', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
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

  const handleMultipleReservation = async () => {
    if (activeTimeSlots.length === 0) {
      await openInfoDialog({
        title: '請選擇時段',
        content: '請至少選擇一個時段進行預約',
      });
      return;
    }
    const selected = timeSlots
      .filter((x) => activeTimeSlots.includes(x.id))
      .sort((a, b) => moment(a.start, 'HH:mm').diff(moment(b.start, 'HH:mm'))); // 先排序時段

    // 檢查是否連續
    let isContinuous = true;
    for (let i = 1; i < selected.length; i++) {
      const prevEnd = moment(selected[i - 1].end, 'HH:mm');
      const currentStart = moment(selected[i].start, 'HH:mm');
      if (!currentStart.isSame(prevEnd)) {
        isContinuous = false;
        break;
      }
    }

    if (!isContinuous) {
      await openInfoDialog({
        title: '選取錯誤',
        content: '您選擇的時段不連續，請重新選擇連續的時段',
      });
      return;
    }
    try {
      const { success, data, message } = await checkIsUse();
      if (!success) {
        await openInfoDialog({
          title: '預約限制',
          content: message || '今天已經有開放球局，不能預約當天',
        });
        return;
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
      return;
    }
    const confirmText = selected.map((s) => `${s.start} - ${s.end}`).join('\n');

    const confirmed = await openConfirmDialog({
      title: '確認預約',
      content: `確認預約以下時段？\n${confirmText}`,
    });

    if (!confirmed) return;

    try {
      (navigation as any).navigate('Main', {
        screen: 'Member',
        params: {
          screen: 'Payment',
          params: {
            type: 'bookGame',
            payData: {
              poolTableUId: tableItem.uid,
              bookDate: selectedDate,
              selectedTime: selected,
            },
            totalAmount: store.deposit * selected.length,
          },
        },
      });
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
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
            title={'預約開台'}
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
                  <Text style={styles.pricingDetails}>
                    {currentRegularSlot.startTime} -{currentRegularSlot.endTime}
                  </Text>
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pricingCard}>
                <Text style={styles.pricingAmount}>
                  <NumberFormatter number={todayPricing.discountRate * 60} />
                  元/小時
                </Text>
                <Text style={styles.pricingDetails}>優惠時段</Text>
                <Text style={styles.pricingDetails}>
                  <Text style={styles.pricingDetails}>
                    {currentDiscountSlot.startTime} -
                    {currentDiscountSlot.endTime}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            style={styles.tablesSection}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            {timeSlots.map((slot, index) => (
              <TimeSlotSelector
                key={index}
                start={slot.start}
                end={slot.end}
                rate={slot.rate}
                status={
                  slot.status === 'booked'
                    ? 'booked'
                    : activeTimeSlots.includes(slot.id)
                    ? 'selected'
                    : 'available'
                }
                onSelect={handleMultipleReservation}
                onPress={() => handleSelectSlot(slot.id)} // 點選卡片區域切換選取
                onCancel={() => handleSelectSlot(slot.id)} // 點選取消按鈕取消該時段
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
