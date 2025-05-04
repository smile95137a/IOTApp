import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { fetchGameOrders } from '../../api/gameOrderApi';
import { GameTransactionRecord } from '../../api/transactionApi';
import NoData from '../../component/NoData';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const GameHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchGameOrders();
        dispatch(hideLoading());
        setIsFetched(true);
        if (success) {
          const sortedData = [...data].sort((a, b) =>
            moment(b.startTime, 'YYYY/MM/DD HH:mm:ss').diff(
              moment(a.startTime, 'YYYY/MM/DD HH:mm:ss')
            )
          );
          setTransactions(sortedData);
        } else {
          setTransactions([]);
          await openInfoDialog({
            title: '錯誤',
            content: message || '無法載入資訊',
          });
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

    loadTransactions();
  }, []);

  const getStatusInfo = (status: string): { label: string; color: string } => {
    switch (status) {
      case 'NO_PAY':
        return { label: '未付款', color: '#9E9E9E' };
      case 'IS_PAY':
        return { label: '已付款', color: '#4CAF50' };
      case 'CANCEL':
        return { label: '已取消', color: '#F44336' };
      default:
        return { label: '未知狀態', color: '#9E9E9E' };
    }
  };

  const handleTransactionPress = async (item: GameTransactionRecord) => {
    console.log('[未付款紀錄]', item);
    if (item.status !== 'NO_PAY') return;

    navigation.navigate('Payment', {
      type: 'payEnd',
      payData: {
        gameId: item.gameId,
        poolUId: item.poolTableUid,
        totalPrice: item.totalPrice,
      },
      totalAmount: item.totalPrice,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無遊戲紀錄" />
      ) : (
        transactions.map((item, index) => {
          const statusInfo = getStatusInfo(item.status);
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleTransactionPress(item)}
            >
              <View style={styles.transactionItem}>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionLocation}>
                    {item.gameOrderName}
                  </Text>
                  <Text style={styles.transactionInfo}>
                    {item.startTime} - {item.endTime}
                  </Text>
                  <Text
                    style={[
                      styles.transactionInfo,
                      { color: statusInfo.color },
                    ]}
                  >
                    {statusInfo.label}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  NT
                  <NumberFormatter number={item.totalPrice} />
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
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

export default GameHistoryScreen;
