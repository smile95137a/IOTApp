import { GameTransactionRecord } from '@/api/transactionApi';
import { getBookGameList, cancelBook, bookStart } from '@/api/gameApi';
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

const GameHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);

  const loadTransactions = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await getBookGameList();
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

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleBookAction = (item: GameTransactionRecord) => {
    Alert.alert('選擇操作', '請選擇要對預約進行的操作', [
      {
        text: '取消預約',
        style: 'destructive',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const res = await cancelBook({ gameId: item.gameId });
            dispatch(hideLoading());
            if (res.success) {
              Alert.alert('已取消預約');
              loadTransactions();
            } else {
              Alert.alert('錯誤', res.message || '取消失敗');
            }
          } catch (err) {
            dispatch(hideLoading());
            Alert.alert(
              '錯誤',
              err instanceof Error ? err.message : '取消失敗'
            );
          }
        },
      },
      {
        text: '開台（開始遊戲）',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const res = await bookStart({
              gameId: item.gameId,
              poolTableId: item.poolTableId,
            });
            dispatch(hideLoading());
            if (res.success) {
              Alert.alert('遊戲已啟動');
              loadTransactions();
            } else {
              Alert.alert('錯誤', res.message || '開台失敗');
            }
          } catch (err) {
            dispatch(hideLoading());
            const msg =
              err?.response?.data?.message ||
              (err instanceof Error ? err.message : '開台失敗');
            Alert.alert('錯誤', msg);
          }
        },
      },
      { text: '取消', style: 'cancel' },
    ]);
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'BOOK':
        return <Text style={styles.statusBooked}>預約中</Text>;
      case 'COMPLETE':
        return <Text style={styles.statusCompleted}>已完成</Text>;
      case 'CANCEL':
        return <Text style={styles.statusCanceled}>已取消</Text>;
      default:
        return <Text style={styles.statusUnknown}>未知狀態</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {transactions.map((item) => (
        <TouchableOpacity
          key={item.id}
          disabled={item.status !== 'BOOK'}
          onPress={() => handleBookAction(item)}
        >
          <View
            style={[
              styles.transactionItem,
              item.status === 'BOOK' && { backgroundColor: '#F0F8FF' },
            ]}
          >
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionLocation}>{item.storeName}</Text>
              <Text style={styles.transactionInfo}>{item.poolTableName}</Text>
              <Text style={styles.transactionInfo}>
                {item.startTime} - {item.endTime}
              </Text>
            </View>
            {renderStatus(item.status)}
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderRadius: 8,
  },
  transactionDetails: {
    flex: 1,
    gap: 4,
  },
  transactionLocation: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  transactionInfo: {
    marginTop: 4,
    fontSize: 15,
    color: '#555',
  },
  statusBooked: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  statusCompleted: {
    fontSize: 14,
    color: '#388E3C',
    fontWeight: 'bold',
  },
  statusCanceled: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  statusUnknown: {
    fontSize: 14,
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
});

export default GameHistoryScreen;
