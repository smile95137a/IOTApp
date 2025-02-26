import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';

const PaymentScreen = ({ navigation }: any) => {
  const { presentApplePay } = useStripe();

  const handleApplePay = async () => {
    try {
      const { error } = await presentApplePay({
        cartItems: [
          { label: 'Product 1', amount: '300.00' },
          { label: 'Product 2', amount: '450.00' },
        ],
        country: 'TW',
        currency: 'TWD',
      });
      if (error) {
        Alert.alert('Payment failed', error.message);
      } else {
        Alert.alert('Payment successful', 'Your transaction was successful.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const requestPayment = async () => {
    try {
      const response = await fetch(
        'https://api.linepay.com/v3/payments/request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 750,
            currency: 'TWD',
            orderId: 'order_12345',
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert('LINE Pay', 'Payment successful!');
      } else {
        Alert.alert('LINE Pay', 'Payment failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const requestJkoPay = async () => {
    try {
      const response = await fetch(
        'https://api.jkopay.com/v1/payment/request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 750,
            currency: 'TWD',
            orderId: 'order_12345',
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert('Jko Pay', 'Payment successful!');
      } else {
        Alert.alert('Jko Pay', 'Payment failed');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Apple Pay" onPress={handleApplePay} color="#000" />
      <View style={styles.spacing} />
      <Button title="LINE Pay" onPress={requestPayment} color="#06C755" />
      <View style={styles.spacing} />
      <Button title="街口支付" onPress={requestJkoPay} color="#FF0000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  spacing: {
    height: 20,
  },
});

export default PaymentScreen;
