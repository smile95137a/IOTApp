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
import { getBookGameList, bookStart, cancelBook } from '../../api/gameApi';
import { GameTransactionRecord } from '../../api/transactionApi';
import { fetchUserInfo } from '../../api/userApi';
import NoData from '../../component/NoData';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { getErrorMessage } from '../../utils/errorUtils';

const GameHistoryScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog, openConfirmDialog } = useDialog();

  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  const loadTransactions = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await getBookGameList();
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
          confirmText: '我知道了',
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

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleBookAction = async (item: GameTransactionRecord) => {
    const confirmed = await openConfirmDialog({
      title: '預約操作',
      content: '請選擇要對預約進行的操作',
      confirmText: '開台（開始遊戲）',
      cancelText: '取消預約',
    });

    if (confirmed) {
      await handleBookStart(item);
    } else {
      await handleBookCancel(item);
    }
  };

  const handleBookStart = async (item: GameTransactionRecord) => {
    try {
      dispatch(showLoading());
      const res = await bookStart({
        gameId: item.gameId,
        poolTableId: item.poolTableId,
      });
      dispatch(hideLoading());
      if (res.success) {
        await openInfoDialog({
          title: '成功',
          content: '遊戲已啟動',
          confirmText: '我知道了',
        });
        loadTransactions();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: res.message || '開台失敗',
          confirmText: '我知道了',
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

  const handleBookCancel = async (item: GameTransactionRecord) => {
    try {
      dispatch(showLoading());
      const res = await cancelBook({ gameId: item.gameId });
      dispatch(hideLoading());
      if (res.success) {
        await openInfoDialog({
          title: `已取消預約`,
          content: '球桌租金已退回至蹭送金額，請確認。',
          confirmText: '我知道了',
        });
        loadTransactions();
        const getUserInfo = async () => {
          try {
            dispatch(showLoading());
            const response = await fetchUserInfo();
            dispatch(hideLoading());

            if (response.success) {
              console.log('[User Info] API Response:', response.data);
              dispatch(setUser(response.data));
            } else {
              console.warn('[User Info] Fetch failed:', response.message);
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

        getUserInfo();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: res.message || '取消失敗',
          confirmText: '我知道了',
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
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無預約紀錄" />
      ) : (
        transactions.map((item) => (
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
