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

const PaymentScreen = ({ navigation }: any) => {
  const handlePaymentPress = (method) => {
    navigation.navigate('PaymentSuccess');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.orderItem}>訂單內容：</Text>
          <Text style={styles.orderDetail}>- 2小時球桌租金 200</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>總金額：200元</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          {[
            {
              label: '儲值金結帳',
              detail: '餘800元',
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
