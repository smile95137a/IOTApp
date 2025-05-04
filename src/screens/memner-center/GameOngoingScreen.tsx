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
import { fetchGameRecords } from '../../api/gameRecordApi';
import { GameTransactionRecord } from '../../api/transactionApi';
import NoData from '../../component/NoData';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const GameOngoingScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchGameRecords();
        dispatch(hideLoading());
        setIsFetched(true);

        if (success) {
          if (!data || data.length === 0) {
            setTransactions([]);
            await openInfoDialog({
              title: '提醒',
              content: '目前尚無進行中的紀錄',
            });
            return;
          }
          setTransactions(data);
        } else {
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

  const handleTransactionPress = (transaction: any) => {
    (navigation as any).navigate('Contact', { transaction });
  };

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無進行中的紀錄" />
      ) : (
        transactions.map((item) => (
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

export default GameOngoingScreen;
