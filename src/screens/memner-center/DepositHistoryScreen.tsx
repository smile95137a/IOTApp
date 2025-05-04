import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {
  TransactionRecord,
  fetchUserTransactionRecord,
  getPayType,
} from '../../api/transactionRecordApi';
import DateFormatter from '../../component/DateFormatter';
import NoData from '../../component/NoData';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const DepositHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchUserTransactionRecord();
        dispatch(hideLoading());
        setIsFetched(true);
        if (success) {
          const sortedData = [...data].sort((a, b) =>
            moment(b.createdAt, 'YYYY/MM/DD HH:mm:ss').diff(
              moment(a.createdAt, 'YYYY/MM/DD HH:mm:ss')
            )
          );
          setTransactions(sortedData);
        } else {
          setTransactions([]);
          await openInfoDialog({
            title: '錯誤',
            content: message || '無法載入交易紀錄',
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

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無儲值紀錄" />
      ) : (
        transactions.map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionDate}>
                <DateFormatter
                  date={item.createdAt}
                  format="YYYY.MM.DD HH:mm"
                />
              </Text>
              <Text style={styles.transactionLocation}>儲值紀錄</Text>
              <Text style={styles.transactionInfo}>
                {getPayType(item.payType)}
              </Text>
            </View>
            <Text style={styles.transactionAmount}>
              NT
              <NumberFormatter number={item.amount} />
            </Text>
          </View>
        ))
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

export default DepositHistoryScreen;
