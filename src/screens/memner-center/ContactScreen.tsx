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

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (transaction?.startTime && transaction?.timeSlots) {
      const startTime = moment(transaction.startTime, 'YYYY/MM/DD HH:mm:ss');
      const now = moment();

      // 找出當前時間所屬的時段
      const matchedSlot = transaction.timeSlots.find((slot) => {
        const start = moment(slot.startTime, 'HH:mm:ss');
        const end = moment(slot.endTime, 'HH:mm:ss');
        return now.isBetween(start, end, null, '[)');
      });

      if (matchedSlot) {
        setCurrentSlot(matchedSlot);
      }

      // 啟動計時器
      const updateTimer = () => {
        const now = moment();
        setElapsedTime(now.diff(startTime, 'seconds'));
      };
      updateTimer(); // 初始更新
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
          {currentSlot && (
            <View style={styles.timerTopRow}>
              <View style={styles.rateBox}>
                <Text style={styles.price}>
                  {currentSlot.isDiscount ? '優惠時段：' : '一般時段：'}
                  <NumberFormatter number={60 * ~~currentSlot.rate} />
                  元/小時
                </Text>
              </View>
            </View>
          )}

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
});

export default ContactScreen;
