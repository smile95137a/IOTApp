import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NumberFormatter from '@/components/common/NumberFormatter';
import { fetchPoolTableByUid } from '@/services/frontend/poolTableService';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useDialog } from '@/context/DialogContext';
import { useLoading } from '@/context/frontend/LoadingContext';

const Reservation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { setLoading } = useLoading();
  const tableUid = searchParams.get('tableUid');

  const [poolTable, setPoolTable] = useState<any>(null);
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );
  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    if (tableUid) {
      loadPoolTable();
    }
  }, [isLogin, tableUid]);

  const loadPoolTable = async () => {
    try {
      const response = await fetchPoolTableByUid(tableUid);
      if (response.success) {
        setPoolTable(response.data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '無法獲取桌檯資訊',
        });
        navigate('/main');
      }
    } catch (error: any) {
      await openInfoDialog({
        title: '錯誤',
        content: error.message || '發生錯誤',
      });
    }
  };

  const handleConfirmPayment = () => {
    navigate('/payment', {
      state: {
        type: 'game',
        payData: { uid: tableUid },
        totalAmount: poolTable?.deposit,
      },
    });
  };

  return (
    <div className="reservation">
      <h2 className="reservation__title">訂單內容</h2>

      <div className="reservation__order">
        <p className="reservation__label">- 球桌租金</p>
        <p className="reservation__amount">
          <NumberFormatter number={poolTable?.deposit} /> 元
        </p>
        <div className="reservation__total">
          <span className="reservation__total-label">總金額：</span>
          <span className="reservation__total-amount">
            <NumberFormatter number={poolTable?.deposit} /> 元
          </span>
        </div>
      </div>

      <div className="reservation__confirm">
        <button
          className="reservation__confirm-button"
          onClick={handleConfirmPayment}
        >
          確認付費
        </button>
      </div>
    </div>
  );
};

export default Reservation;
