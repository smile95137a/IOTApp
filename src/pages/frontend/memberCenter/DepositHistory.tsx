import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { AppDispatch } from '@/store';
import { getErrorMessage } from '@/utils/errorUtils';
import { useLoading } from '@/context/frontend/LoadingContext';
import {
  fetchUserTransactionRecord,
  getPayType,
} from '@/services/frontend/transactionRecordService';
import DateFormatter from '@/components/common/DateFormatter';
import NumberFormatter from '@/components/common/NumberFormatter';
import NoData from '@/components/frontend/NoData';
import { useDialog } from '@/context/DialogContext';

const DepositHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { setLoading } = useLoading();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { success, data, message } = await fetchUserTransactionRecord();
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
          await openInfoDialog({
            title: '錯誤',
            content: message || '無法載入交易紀錄',
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

    loadTransactions();
  }, []);

  return (
    <div className="deposit-history">
      <h2 className="memberCenter__title">儲值紀錄</h2>

      {isFetched && transactions.length === 0 ? (
        <NoData text="目前尚無儲值紀錄" />
      ) : (
        <div className="deposit-history__list">
          {transactions.map((item) => (
            <div className="deposit-history__item" key={item.id}>
              <div className="deposit-history__details">
                <div className="deposit-history__date">
                  <DateFormatter
                    date={item.createdAt}
                    format="YYYY.MM.DD HH:mm"
                  />
                </div>
                <div className="deposit-history__label">儲值紀錄</div>
                <div className="deposit-history__method">
                  {getPayType(item.payType)}
                </div>
              </div>
              <div className="deposit-history__amount">
                NT <NumberFormatter number={item.amount} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepositHistory;
