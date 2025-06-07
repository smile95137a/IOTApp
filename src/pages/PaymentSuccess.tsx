import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NumberFormatter from '@/components/common/NumberFormatter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { getUserInfo } from '@/services/frontend/userService';
import { setUser } from '@/store/slices/frontend/authSlice';
import { useDialog } from '@/context/DialogContext';

const PaymentSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { type, totalAmount, showStartGame, data } = location.state || {};

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await getUserInfo();
        if (response.success) {
          dispatch(setUser(response.data));
        } else {
          console.warn('取得使用者資料失敗:', response.message);
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        await openInfoDialog({
          title: '錯誤',
          content: error.message || '發生錯誤',
        });
      }
    };

    loadUserInfo();
  }, [dispatch, openInfoDialog]);

  const handleStartGame = () => {
    navigate('/contact', {
      state: {
        transaction: {
          ...data.gameRecord,
          storePhone: data.storePhone,
          timeSlots: data.timeSlots,
        },
      },
    });
  };

  return (
    <div className="payment-success">
      <div className="payment-success__message">
        <h2 className="payment-success__title">付費成功！</h2>
        <div className="payment-success__divider" />
        <p className="payment-success__amount">
          <span className="payment-success__amount-label">總金額：</span>
          $<NumberFormatter number={~~totalAmount} /> 元
        </p>
      </div>

      {showStartGame && (
        <div className="payment-success__action">
          <button
            className="payment-success__start-button"
            onClick={handleStartGame}
          >
            前往球局
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
