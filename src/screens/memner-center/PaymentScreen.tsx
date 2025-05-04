import { useRoute } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { startGame, checkoutGame, bookGame } from '../../api/gameApi';
import { checkoutGameGamePay } from '../../api/gamePayApi';
import { topUp } from '../../api/paymentApi';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const PaymentScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { type, payData, totalAmount, rechargeOption } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const handlePaymentPress = async (method: string, payType: number) => {
    try {
      dispatch(showLoading());

      let result;

      if (type === 'game') {
        result = await startGame({ poolTableUId: payData.uid });
      } else if (type === 'gameEnd') {
        result = await checkoutGame({
          payType,
          gameId: payData.gameId,
          poolTableId: payData.poolTableId,
        });
      } else if (type === 'recharge') {
        result = await topUp({
          price: rechargeOption.rechargeAmount,
          payType,
          point: rechargeOption.bonusAmount,
        });
      } else if (type === 'payEnd') {
        result = await checkoutGameGamePay({
          payType,
          gameId: payData.gameId,
          poolUId: payData.poolUId,
          totalPrice: payData.totalPrice,
        });
      } else if (type === 'bookGame') {
        const { poolTableUId, bookDate, selectedTime } = payData;

        if (!Array.isArray(selectedTime) || selectedTime.length === 0) {
          throw new Error('未提供有效的時段資料');
        }

        const first = selectedTime[0];
        const last = selectedTime[selectedTime.length - 1];
        result = await bookGame({
          poolTableUId,
          bookDate,
          payType,
          startTime: moment(
            `${bookDate} ${first.start}`,
            'YYYY-MM-DD HH:mm'
          ).format('YYYY/MM/DD HH:mm'),
          endTime: moment(`${bookDate} ${last.end}`, 'YYYY-MM-DD HH:mm').format(
            'YYYY/MM/DD HH:mm'
          ),
        });
      } else {
        result = await startGame({ poolTableUId: payData.uid });
      }

      const { code, success, data, message } = result;

      dispatch(hideLoading());
      if (success && data) {
        if (type === 'recharge') {
          (navigation as any).navigate('RechargeSuccess', { totalAmount });
        } else {
          (navigation as any).navigate('PaymentSuccess', {
            type,
            showStartGame: type === 'game',
            totalAmount,
            data,
          });
        }
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '處理付款時發生錯誤',
        });
        if (code === 4064) {
          (navigation as any).reset({
            index: 0,
            routes: [
              {
                name: 'Member',
                state: {
                  routes: [{ name: 'Recharge' }],
                },
              },
            ],
          });
        }
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

  const paymentMethods = [
    {
      label: '儲值金結帳',
      detail: '',
      icon: 'account-balance-wallet',
      image: require('../../assets/iot-pay1.png'),
      payType: 1,
    },
    {
      label: '信用卡結帳',
      detail: '',
      icon: 'credit-card',
      payType: 2,
    },
    {
      label: 'LINE PAY',
      detail: '',
      icon: 'payment',
      image: require('../../assets/iot-line-pay.png'),
      payType: 3,
    },
    {
      label: '街口支付',
      detail: '',
      icon: 'store',
      image: require('../../assets/iot-l-pay.png'),
      payType: 4,
    },
    {
      label: 'Apple Pay',
      detail: '',
      icon: 'apple',
      image: require('../../assets/iot-apple-pay.png'),
      payType: 5,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.orderItem}>訂單內容：</Text>
          <Text style={styles.orderDetail}>
            {type === 'recharge'
              ? '- 儲值金額 '
              : `- 球桌${
                  type === 'game' || type === 'bookGame' ? '租金' : '費用'
                } `}
            <NumberFormatter number={totalAmount} />
          </Text>

          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>
              總金額：
              <NumberFormatter number={totalAmount} />元
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          {paymentMethods
            .filter((method) => !(type === 'recharge' && method.payType === 1))
            .map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.paymentButton}
                onPress={() => handlePaymentPress(method.label, method.payType)}
              >
                <View style={styles.paymentInfo}>
                  {method.image ? (
                    <Image source={method.image} style={styles.methodImage} />
                  ) : (
                    <Icon
                      name={method.icon}
                      size={24}
                      color="#333"
                      style={styles.paymentIcon}
                    />
                  )}
                  <Text style={styles.paymentLabel}>{method.label}</Text>
                </View>
                <View style={styles.paymentDetailsContainer}>
                  <Text style={styles.paymentDetail}>{method.detail}</Text>
                  <Icon name="chevron-right" size={32} color="#000" />
                </View>
                <Image
                  source={require('../../assets/iot-pay-bg.png')}
                  style={styles.absoluteImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65BC85',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBalance: {
    fontSize: 14,
    color: '#fff',
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDetails: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  orderItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  orderDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C8545F',
  },
  paymentMethods: {
    marginBottom: 16,
  },
  paymentButton: {
    height: 73,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,

    position: 'relative', // Ensure relative positioning for child absolute elements
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 8,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#333',
  },
  paymentDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetail: {
    fontSize: 14,
    color: '#C8545F',
    marginRight: 8,
  },
  absoluteImage: {
    position: 'absolute',
    right: 20,
    width: 132,
    height: 112,
    zIndex: -1,
    opacity: 0.1,
  },
  methodImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 8,
  },
});

export default PaymentScreen;
