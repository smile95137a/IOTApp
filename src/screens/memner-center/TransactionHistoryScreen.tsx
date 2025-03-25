import {
  fetchUserTransactions,
  GameTransactionRecord,
} from '@/api/transactionApi';
import DateFormatter from '@/component/DateFormatter';
import NumberFormatter from '@/component/NumberFormatter';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';

const TransactionHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchUserTransactions();
        dispatch(hideLoading());
        if (success) {
          setTransactions(data);
        } else {
          Alert.alert('錯誤', message || '無法載入資訊');
        }
      } catch (error) {
        dispatch(hideLoading());
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Alert.alert('錯誤', errorMessage);
      }
    };

    loadTransactions();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {transactions.map((item) => (
        <View key={item.id} style={styles.transactionItem}>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionDate}>
              <DateFormatter date={item.createdAt} format="YYYY.MM.DD HH:mm" />
            </Text>
            <Text style={styles.transactionLocation}>{item.storeName}</Text>
            <Text style={styles.transactionInfo}>{item.tableNumber}</Text>
          </View>
          <Text style={styles.transactionAmount}>
            NT
            <NumberFormatter number={item.amount} />
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  transactionList: {
    paddingBottom: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
    marginTop: 6,
    fontSize: 16,
  },
  transactionAmount: {
    fontSize: 16,
    color: '#E21A1C',
    textAlign: 'right',
  },
});

export default TransactionHistoryScreen;
