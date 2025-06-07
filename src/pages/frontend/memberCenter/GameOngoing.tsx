import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';
import { fetchGameRecords } from '@/services/frontend/gameRecordService';
import { useDialog } from '@/context/DialogContext';
import { title } from 'process';

const GameOngoing: React.FC = () => {
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { success, data, message } = await fetchGameRecords();
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
        await openInfoDialog({
          title: '錯誤',
          content: error.message || '發生錯誤',
        });
      }
    };

    loadTransactions();
  }, []);

  const handleTransactionClick = (transaction: any) => {
    navigate('/member-center/contact', { state: { transaction } });
  };

  return (
    <div className="game-ongoing">
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無進行中的紀錄" />
      ) : (
        transactions.map((item) => (
          <div
            key={item.id}
            className="game-ongoing__item"
            onClick={() => handleTransactionClick(item)}
          >
            <div className="game-ongoing__details">
              <div className="game-ongoing__store">{item.storeName}</div>
              <div className="game-ongoing__table">{item.poolTableName}</div>
            </div>
            <div className="game-ongoing__amount">
              NT <NumberFormatter number={item.price} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GameOngoing;
