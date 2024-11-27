import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const transactionHistory = [
  {
    id: 1,
    date: '2024.6.12 16:00',
    location: '板橋旗艦店',
    details: '開台2局',
    amount: 'NT$ 2,500',
  },
  {
    id: 2,
    date: '2024.6.12 16:00',
    location: '板橋旗艦店',
    details: '開台2局',
    amount: 'NT$ 2,500',
  },
  {
    id: 3,
    date: '2024.6.12 16:00',
    location: '板橋旗艦店',
    details: '開台2局',
    amount: 'NT$ 2,500',
  },
  {
    id: 4,
    date: '2024.6.12 16:00',
    location: '板橋旗艦店',
    details: '開台2局',
    amount: 'NT$ 2,500',
  },
];

const TransactionHistoryScreen = ({ navigation }: any) => {
  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionLocation}>{item.location}</Text>
        <Text style={styles.transactionInfo}>{item.details}</Text>
      </View>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Transaction List */}
      <FlatList
        data={transactionHistory}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.transactionList}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  userInfo: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBalance: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  transactionList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // 简洁的分割线颜色
  },
  transactionDetails: {
    flex: 1,
    gap: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 5,
  },
  transactionLocation: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  transactionInfo: {
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    color: '#E21A1C',
    textAlign: 'right',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#DDD',
    backgroundColor: '#FFF',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  navCenter: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30, // 提升到导航栏上方
  },
});

export default TransactionHistoryScreen;
