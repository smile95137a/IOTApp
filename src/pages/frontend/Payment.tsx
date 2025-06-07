import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import NumberFormatter from '@/components/common/NumberFormatter';

import { topUp } from '@/services/frontend/paymentService';
import { getErrorMessage } from '@/utils/errorUtils';
import {
  bookGame,
  checkoutGame,
  startGame,
} from '@/services/frontend/gameService';
import { checkoutGameGamePay } from '@/services/frontend/gamePayService';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { useDialog } from '@/context/DialogContext';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { type, payData, totalAmount, rechargeOption } = location.state || {};
  const [finalAmount, setFinalAmount] = useState<number>(totalAmount ?? 0);
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );
  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      return;
    }
  }, [isLogin]);
  const handlePayment = async (label: string, payType: number) => {
    try {
      if (type === 'gameEnd' && finalAmount < 0) {
        await openInfoDialog({
          title: '提醒',
          content:
            '您好：\n因結帳金額未達球檯租金\n將返還至會員儲值金額帳戶內，提供下次使用。\n如需申請電子支付退款，請洽門店店長。感謝！',
        });
      }

      let result;
      if (type === 'game') {
        result = await startGame({ poolTableUId: payData.uid, payType });
      } else if (type === 'gameEnd') {
        result = await checkoutGame({
          payType,
          gameId: payData.gameId,
          poolTableId: payData.poolTableId,
        });
      } else if (type === 'recharge') {
        result = await topUp({
          price: rechargeOption.rechargeAmount,
          payType,
          point: rechargeOption.bonusAmount,
        });
      } else if (type === 'payEnd') {
        result = await checkoutGameGamePay({
          payType,
          gameId: payData.gameId,
          poolUId: payData.poolUId,
          totalPrice: payData.totalPrice,
        });
      } else if (type === 'bookGame') {
        const { poolTableUId, bookDate, selectedTime } = payData;
        console.log({ poolTableUId, bookDate, selectedTime });

        if (!Array.isArray(selectedTime) || selectedTime.length === 0) {
          throw new Error('未提供有效的時段資料');
        }
        const first = selectedTime[0];
        const last = selectedTime[selectedTime.length - 1];
        result = await bookGame({
          poolTableUId,
          bookDate,
          payType,
          startTime: moment(
            `${bookDate} ${first.start}`,
            'YYYY-MM-DD HH:mm'
          ).format('YYYY/MM/DD HH:mm'),
          endTime: moment(`${bookDate} ${last.end}`, 'YYYY-MM-DD HH:mm').format(
            'YYYY/MM/DD HH:mm'
          ),
        });
      } else {
        result = await startGame({ poolTableUId: payData.uid });
      }

      const { code, success, data, message } = result;
      if (success && data) {
        if (type === 'recharge') {
          navigate('/payment-success', {
            state: { totalAmount: finalAmount },
          });
        } else {
          navigate('/payment-success', {
            state: {
              type,
              showStartGame: type === 'game',
              finalAmount,
              data,
            },
          });
        }
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '處理付款時發生錯誤',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const getOrderDetailText = () => {
    if (type === 'gameEnd' && payData?.gameData) {
      const {
        deposit = 0,
        discountPrice = 0,
        regularPrice = 0,
        totalPrice = 0,
        totalDiscountMinutes = 0,
        totalRegularMinutes = 0,
        discountHourlyRate,
        regularHourlyRate,
      } = payData.gameData;

      let detail = `・球台租金: -${deposit} 元(已支付)\n`;
      if (totalRegularMinutes > 0) {
        detail += `      一般時段(${
          regularHourlyRate || '-'
        }元/小時):${totalRegularMinutes} 分鐘，計 ${regularPrice} 元\n`;
      }
      if (totalDiscountMinutes > 0) {
        detail += `      優惠時段(${
          discountHourlyRate || '-'
        }元/小時):${totalDiscountMinutes} 分鐘，計 ${discountPrice} 元\n`;
      }
      detail += `・共計: ${totalPrice} 元\n`;
      return detail;
    }
    return '';
  };

  useEffect(() => {
    if (type === 'gameEnd' && payData?.gameData) {
      const { finalAmount = 0 } = payData.gameData;
      setFinalAmount(finalAmount);
    }
  }, [type, payData]);

  const paymentMethods = [
    { label: '儲值金結帳', icon: 'wallet', payType: 1 },
    { label: '信用卡結帳', icon: 'credit-card', payType: 2 },
    { label: 'LINE PAY', icon: 'line', payType: 3 },
    { label: '街口支付', icon: 'lpay', payType: 4 },
    { label: 'Apple Pay', icon: 'apple', payType: 5 },
  ];

  return (
    <div className="payment">
      <h2 className="payment__title">付款資訊</h2>

      <div className="payment__order">
        <p className="payment__label">訂單內容：</p>
        {type === 'gameEnd' ? (
          <pre className="payment__info">{getOrderDetailText()}</pre>
        ) : (
          <p className="payment__info">
            {type === 'recharge'
              ? '・ 儲值金額 '
              : `・ 球桌${
                  type === 'game' || type === 'bookGame' ? '租金' : '費用'
                } `}
            <NumberFormatter number={finalAmount} /> 元
          </p>
        )}
        <p className="payment__total">
          總金額：{finalAmount.toLocaleString()} 元
        </p>
        {type === 'gameEnd' && finalAmount < 0 && (
          <p className="payment__hint">未達球台租金，請點選任意結帳方式。</p>
        )}
      </div>

      <div className="payment__methods">
        {paymentMethods
          .filter((m) => !(type === 'recharge' && m.payType === 1))
          .map((method) => (
            <button
              key={method.payType}
              className="payment__method"
              onClick={() => handlePayment(method.label, method.payType)}
            >
              <span className={`payment__icon payment__icon--${method.icon}`} />
              <span className="payment__label">{method.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default Payment;
