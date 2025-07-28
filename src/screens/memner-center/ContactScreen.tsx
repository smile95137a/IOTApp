import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { Linking } from 'react-native';
import { getGamePrice } from '../../api/gameApi';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { logJson } from '../../utils/logJsonUtils';

const ContactScreen = ({ navigation, route }) => {
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const { transaction } = route.params || {};
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [mergedSlots, setMergedSlots] = useState<{
    regular?: { startTime: string; endTime: string };
    discount?: { startTime: string; endTime: string };
  }>({});
  const isCurrentSlotRegular = currentSlot && !currentSlot.isDiscount;
  const isCurrentSlotDiscount = currentSlot && currentSlot.isDiscount;

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    logJson('zxc', transaction);
    if (transaction?.startTime && transaction?.timeSlots) {
      const startTime = moment(transaction.startTime, 'YYYY/MM/DD HH:mm:ss');

      // 合併時段區間
      const regularTimes = transaction.timeSlots.filter((s) => !s.isDiscount);
      const discountTimes = transaction.timeSlots.filter((s) => s.isDiscount);

      const getMinMaxTime = (slots: typeof transaction.timeSlots) => {
        if (!slots.length) return undefined;
        const times = slots.map((s) => ({
          start: moment(s.startTime, 'HH:mm:ss'),
          end: moment(s.endTime, 'HH:mm:ss'),
        }));
        const min = moment.min(times.map((t) => t.start));
        const max = moment.max(times.map((t) => t.end));
        return {
          startTime: min.format('HH:mm:ss'),
          endTime: max.format('HH:mm:ss'),
        };
      };

      setMergedSlots({
        regular: getMinMaxTime(regularTimes),
        discount: getMinMaxTime(discountTimes),
      });

      // 計時器
      const updateTimer = () => {
        const now = moment();
        setElapsedTime(now.diff(startTime, 'seconds'));

        const matchedSlot = transaction.timeSlots.find((slot) => {
          const start = moment(slot.startTime, 'HH:mm:ss');
          const end = moment(slot.endTime, 'HH:mm:ss');
          return now.isBetween(start, end, null, '[)');
        });

        setCurrentSlot(matchedSlot || null);
      };

      updateTimer(); // 初始
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [transaction]);

  // 計算小時、分鐘、秒
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  // 點擊結束球局
  const handleEndGame = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await getGamePrice({
        gameId: transaction.gameId,
      });
      logJson('gameEnd', data);
      dispatch(hideLoading());

      if (success) {
        (navigation as any).navigate('Payment', {
          type: 'gameEnd',
          payData: {
            gameId: transaction.gameId,
            poolTableId: transaction.poolTableId,
            gameData: data,
          },
          totalAmount: data.totalPrice,
        });
      } else {
        openInfoDialog({
          title: '錯誤',
          content: message || '無法載入店家資訊',
        });
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

  const handleCall = async () => {
    const phoneNumber = transaction?.storePhone;
    if (phoneNumber) {
      const confirmed = await openConfirmDialog({
        title: '撥打電話',
        content: `確定要撥打 ${phoneNumber} 嗎？`,
        confirmText: '撥打',
        cancelText: '取消',
      });

      if (confirmed) {
        Linking.openURL(`tel:${phoneNumber}`);
      }
    } else {
      openInfoDialog({
        title: '錯誤',
        content: '找不到電話號碼',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View
          style={[
            styles.timerSection,
            {
              backgroundColor: currentSlot?.isDiscount ? '#F67943' : '#00BFFF',
            },
          ]}
        >
          <View style={styles.slotListContainer}>
            <Text style={styles.slotSectionTitle}>費率時段一覽</Text>

            <View style={styles.slotGrid}>
              {mergedSlots.regular && (
                <View
                  style={[
                    styles.slotCard,
                    isCurrentSlotRegular && styles.slotCardActive,
                  ]}
                >
                  <View style={styles.slotCardHeader}>
                    <FontAwesome
                      name="clock-o"
                      size={16}
                      color="#4a4a4a"
                      style={styles.slotIcon}
                    />
                    <Text style={styles.slotTitle}>一般</Text>
                  </View>
                  <Text style={styles.slotTime}>
                    {moment(mergedSlots.regular.startTime, 'HH:mm:ss').format(
                      'HH:mm'
                    )}{' '}
                    ~{' '}
                    {moment(mergedSlots.regular.endTime, 'HH:mm:ss').format(
                      'HH:mm'
                    )}
                  </Text>
                  <Text style={styles.slotRate}>合併時段</Text>
                </View>
              )}
              {mergedSlots.discount && (
                <View
                  style={[
                    styles.slotCard,
                    isCurrentSlotDiscount && styles.slotCardActive,
                  ]}
                >
                  <View style={styles.slotCardHeader}>
                    <FontAwesome
                      name="tag"
                      size={16}
                      color="#f67943"
                      style={styles.slotIcon}
                    />
                    <Text style={[styles.slotTitle, styles.discountText]}>
                      優惠
                    </Text>
                  </View>
                  <Text style={styles.slotTime}>
                    {moment(mergedSlots.discount.startTime, 'HH:mm:ss').format(
                      'HH:mm'
                    )}{' '}
                    ~{' '}
                    {moment(mergedSlots.discount.endTime, 'HH:mm:ss').format(
                      'HH:mm'
                    )}
                  </Text>
                  <Text style={styles.slotRate}>合併時段</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.timerTimeContainer}>
            <Text style={styles.timerText}>球局已進行</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>
                {String(hours).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timerColon}>小時</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>
                {String(minutes).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timerColon}>分</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>
                {String(seconds).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timerColon}>秒</Text>
          </View>
        </View>
        <View style={styles.contactContainer}>
          <View style={styles.iconWrapper}>
            <TouchableOpacity onPress={handleCall} style={styles.iconTouchable}>
              <View style={styles.iconCircle}>
                <FontAwesome name="phone" size={26} color="#FFFFFF" />
              </View>
              <Text style={styles.contactTitle}>聯絡加盟商</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.contactSubtitle}>
              機台操作問題，請聯繫 {transaction?.vendorName} 加盟商！
            </Text>
            <Text style={styles.contactSubtitle}>
              聯絡資訊 {transaction?.storePhone}
            </Text>
          </View>
        </View>

        {/* Warm Tips Section */}
        <View style={styles.warmTipsSection}>
          <Text style={styles.warmTipsHeader}>溫馨提示：</Text>
          <Text style={styles.warmTip}>{transaction?.hint}</Text>
        </View>

        {/* End Button */}
        <TouchableOpacity style={styles.endButton} onPress={handleEndGame}>
          <Text style={styles.endButtonText}>結束球局</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    marginBottom: 20,
  },
  timerSection: {
    alignItems: 'center',
    backgroundColor: '#00BFFF',
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 16,
  },
  timerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  timerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerColon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  warmTipsSection: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warmTipsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  warmTip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  endButton: {
    backgroundColor: '#FFC702',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rateBox: {
    paddingHorizontal: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    marginRight: 16,
  },

  iconTouchable: {
    alignItems: 'center',
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  slotListContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  slotSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  slotCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  slotCardActive: {
    backgroundColor: '#fff9e6',
    borderColor: '#ffc107',
    shadowOpacity: 0.12,
    elevation: 3,
  },

  slotCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  slotIcon: {
    marginRight: 6,
  },

  slotTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },

  discountText: {
    color: '#f67943',
  },

  slotTime: {
    fontSize: 13,
    color: '#666',
  },

  slotRate: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
    marginTop: 4,
  },
});

export default ContactScreen;
