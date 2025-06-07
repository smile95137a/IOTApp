import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  getBookGameList,
  bookStart,
  cancelBook,
} from '@/services/frontend/gameService';
import { GameTransactionRecord } from '@/services/frontend/transactionService';
import { getErrorMessage } from '@/utils/errorUtils';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getUserInfo } from '@/services/frontend/userService';
import { setUser } from '@/store/slices/frontend/authSlice';
import NoData from '@/components/frontend/NoData';
import { useDialog } from '@/context/DialogContext';

const MyBookHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { setLoading } = useLoading();

  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { success, data, message } = await getBookGameList();
      setLoading(false);
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
      setLoading(false);
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await getUserInfo();
      setLoading(false);
      if (res.success) {
        dispatch(setUser(res.data));
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      setLoading(false);
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleBookAction = async (item: GameTransactionRecord) => {
    const confirmed = await openConfirmDialog({ content: '預約操作' });
    if (confirmed) {
      await handleBookStart(item);
    } else {
      await handleBookCancel(item);
    }
  };

  const handleBookStart = async (item: GameTransactionRecord) => {
    try {
      setLoading(true);
      const res = await bookStart({
        gameId: item.gameId,
        poolTableId: item.poolTableId,
      });
      setLoading(false);
      if (res.success) {
        await openInfoDialog({
          title: '成功',
          content: '遊戲已啟動',
        });

        loadTransactions();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: res.message || '開台失敗',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      setLoading(false);
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleBookCancel = async (item: GameTransactionRecord) => {
    try {
      setLoading(true);
      const res = await cancelBook({ gameId: item.gameId });
      setLoading(false);
      if (res.success) {
        await openInfoDialog({
          title: '已取消預約',
          content: '球桌租金已退回至蹭送金額，請確認。',
        });

        loadTransactions();
        refreshUser();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: res.message || '取消失敗',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      setLoading(false);
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case 'BOOK':
        return (
          <span className="my-book-history__status my-book-history__status--book">
            預約中
          </span>
        );
      case 'COMPLETE':
        return (
          <span className="my-book-history__status my-book-history__status--complete">
            已完成
          </span>
        );
      case 'CANCEL':
        return (
          <span className="my-book-history__status my-book-history__status--cancel">
            已取消
          </span>
        );
      default:
        return (
          <span className="my-book-history__status my-book-history__status--unknown">
            未知狀態
          </span>
        );
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="my-book-history">
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無預約紀錄" />
      ) : (
        transactions.map((item) => (
          <div
            key={item.id}
            className={`my-book-history__item ${
              item.status === 'BOOK' ? 'my-book-history__item--active' : ''
            }`}
            onClick={() => item.status === 'BOOK' && handleBookAction(item)}
          >
            <div className="my-book-history__details">
              <div className="my-book-history__location">{item.storeName}</div>
              <div className="my-book-history__info">{item.poolTableName}</div>
              <div className="my-book-history__info">
                {item.startTime} - {item.endTime}
              </div>
            </div>
            {renderStatus(item.status)}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookHistory;
