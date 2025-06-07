import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  fetchUserTransactions,
  GameTransactionRecord,
} from '@/services/frontend/transactionService';
import { getErrorMessage } from '@/utils/errorUtils';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import { useLoading } from '@/context/frontend/LoadingContext';
import { useDialog } from '@/context/DialogContext';

const TransactionHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const [transactions, setTransactions] = useState<GameTransactionRecord[]>([]);
  const [isFetched, setIsFetched] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await fetchUserTransactions();
        setLoading(false);
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
          await openInfoDialog('錯誤', message || '無法載入資訊');
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        setLoading(false);
        await openInfoDialog('錯誤', getErrorMessage(error));
      }
    };

    loadTransactions();
  }, []);

  return (
    <div className="transaction">
      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無消費紀錄" />
      ) : (
        transactions.map((item) => (
          <div key={item.id} className="transaction__item">
            <div className="transaction__details">
              <div className="transaction__date">
                <DateFormatter
                  date={item.createdAt}
                  format="YYYY.MM.DD HH:mm"
                />
              </div>
              <div className="transaction__location">{item.storeName}</div>
              <div className="transaction__info">{item.tableNumber}</div>
            </div>
            <div className="transaction__amount">
              NT
              <NumberFormatter number={item.amount} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TransactionHistory;
