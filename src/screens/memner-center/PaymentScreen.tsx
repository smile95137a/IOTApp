import { checkoutGame, startGame } from '@/api/gameApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useRoute } from '@react-navigation/native';
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

const PaymentScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { type, payData, totalAmount } = route.params || {}; // 從參數中獲取付款資訊
  const dispatch = useDispatch<AppDispatch>();

  const handlePaymentPress = async (method) => {
    try {
      dispatch(showLoading());
      const { success, data, message } =
        type === 'game'
          ? await startGame({ poolTableUId: payData.uid })
          : type === 'gameEnd'
          ? await checkoutGame({ payType: 1, gameId: payData.uid })
          : await startGame({ poolTableUId: payData.uid });
      dispatch(hideLoading());
      if (success && data) {
        navigation.navigate('PaymentSuccess', {
          showStartGame: type === 'game',
          totalAmount,
          data,
        });
      } else {
        Alert.alert('錯誤', message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      Alert.alert('錯誤', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.orderItem}>訂單內容：</Text>
          <Text style={styles.orderDetail}>- 球桌租金 {totalAmount}</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>總金額：{totalAmount}元</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          {[
            {
              label: '儲值金結帳',
              detail: '',
              icon: 'account-balance-wallet',
            },
            { label: '信用卡結帳', detail: '', icon: 'credit-card' },
            { label: 'LINE PAY', detail: '', icon: 'payment' },
            { label: '街口支付', detail: '', icon: 'store' },
            { label: 'Apple Pay', detail: '', icon: 'apple' },
          ].map((method, index) => (
            <TouchableOpacity
              key={index}
              style={styles.paymentButton}
              onPress={() => handlePaymentPress(method.label)}
            >
              <View style={styles.paymentInfo}>
                <Icon
                  name={method.icon}
                  size={24}
                  color="#333"
                  style={styles.paymentIcon}
                />
                <Text style={styles.paymentLabel}>{method.label}</Text>
              </View>
              <View style={styles.paymentDetailsContainer}>
                <Text style={styles.paymentDetail}>{method.detail}</Text>
                <Icon name="chevron-right" size={32} color="#000" />
              </View>
              <Image
                source={require('@/assets/iot-pay-bg.png')}
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
    flex: 1,
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
});

export default PaymentScreen;
