import NumberFormatter from '@/component/NumberFormatter';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const RechargeSuccess = ({ route, navigation }) => {
  const { selectedOption } = route.params || {};
  const totalAmount = selectedOption
    ? Number(selectedOption.amount) + Number(selectedOption.bonus)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.messageContainer}>
          <Text style={styles.successText}>儲值成功！</Text>
          <View style={styles.divider} />
          <Text style={styles.totalAmount}>
            <Text style={styles.totalAmountLabel}>總金額：</Text>
            <NumberFormatter number={totalAmount} /> 元
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center', // 讓內容垂直居中
    alignItems: 'center', // 讓內容水平居中
    paddingHorizontal: 20,
  },
  messageContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 20,
    color: '#C8545F',
    fontWeight: 'bold',
    marginTop: 8,
  },
  totalAmountLabel: {
    fontSize: 16,
    color: '#666',
  },
  startGameButton: {
    marginTop: 30,
    backgroundColor: '#FFC702',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  startGameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default RechargeSuccess;
