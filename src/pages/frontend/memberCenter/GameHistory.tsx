import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { fetchGameOrders } from '@/services/frontend/gameOrderService';
import NoData from '@/components/frontend/NoData';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { useNavigate } from 'react-router-dom';
import { useDialog } from '@/context/DialogContext';
import NumberFormatter from '@/components/common/NumberFormatter';

const GameHistoryScreen: React.FC = () => {
  const { openInfoDialog } = useDialog();
  const { setLoading } = useLoading();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await fetchGameOrders();
        setIsFetched(true);
        setLoading(false);
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
        setLoading(false);
        if (error.isAutoLogout) return;
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

  const handleTransactionClick = (item: any) => {
    if (item.status !== 'NO_PAY') return;
    navigate('/payment', {
      state: {
        type: 'payEnd',
        payData: {
          gameId: item.gameId,
          poolUId: item.poolTableUid,
          totalPrice: item.totalPrice,
        },
        totalAmount: item.totalPrice,
      },
    });
  };

  return (
    <div className="game-history">
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無遊戲紀錄" />
      ) : (
        transactions.map((item, index) => {
          const statusInfo = getStatusInfo(item.status);
          return (
            <div
              key={index}
              className="game-history__item"
              onClick={() => handleTransactionClick(item)}
            >
              <div className="game-history__info">
                <p className="game-history__location">{item.gameOrderName}</p>
                <p className="game-history__time">
                  {item.startTime} - {item.endTime}
                </p>
                <p
                  className="game-history__status"
                  style={{ color: statusInfo.color }}
                >
                  {statusInfo.label}
                </p>
              </div>
              <div className="game-history__amount">
                NT <NumberFormatter number={item.totalPrice} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameHistoryScreen;
