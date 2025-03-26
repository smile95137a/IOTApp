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
import { bookStart, cancelBook } from '@/api/gameApi';

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

  const handleCancel = (transaction: GameTransactionRecord) => {
    Alert.alert('確認取消', '你確定要取消這筆預約嗎？', [
      { text: '否', style: 'cancel' },
      {
        text: '是',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const { success, data } = await cancelBook({});
            dispatch(hideLoading());
            Alert.alert('已取消', '您的預約已取消');
          } catch (error) {
            dispatch(hideLoading());
            Alert.alert('錯誤', '取消失敗，請稍後再試');
          }
        },
      },
    ]);
  };

  const handleStart = (transaction: GameTransactionRecord) => {
    Alert.alert('確認取消', '你確定要開始這筆預約嗎？', [
      { text: '否', style: 'cancel' },
      {
        text: '是',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const { success, data } = await bookStart({});
            dispatch(hideLoading());
            Alert.alert('已取消', '您的預約已取消');
          } catch (error) {
            dispatch(hideLoading());
            Alert.alert('錯誤', '取消失敗，請稍後再試');
          }
        },
      },
    ]);
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

          {/* 加入操作按鈕區塊 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancel(item)}
            >
              <Text style={styles.buttonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={() => handleStart(item)}
            >
              <Text style={styles.buttonText}>開始</Text>
            </TouchableOpacity>
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
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 6,
  },

  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  cancelButton: {
    backgroundColor: '#ccc',
  },

  startButton: {
    backgroundColor: '#00C851',
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default MyBookHistoryScreen;
