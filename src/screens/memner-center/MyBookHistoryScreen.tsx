import { GameTransactionRecord } from '@/api/transactionApi';
import NumberFormatter from '@/component/NumberFormatter';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { fetchGameOrders } from '@/api/gameOrderApi';

const MyBookHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchGameOrders();
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

  const handleTransactionPress = (transaction: GameTransactionRecord) => {
    navigation.navigate('Contact', { transaction });
  };

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {transactions.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleTransactionPress(item)}
        >
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionLocation}>{item.storeName}</Text>
              <Text style={styles.transactionInfo}>{item.poolTableName}</Text>
            </View>
            <Text style={styles.transactionAmount}>
              NT
              <NumberFormatter number={item.price} />
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  transactionList: {
    paddingHorizontal: 16,
    paddingTop: 16,
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

export default MyBookHistoryScreen;
