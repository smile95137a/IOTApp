import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import NumberFormatter from '@/components/common/NumberFormatter';
import { getGamePrice } from '@/services/frontend/gameService';
import { useDialog } from '@/context/DialogContext';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { transaction } = state || {};

  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSlot, setCurrentSlot] = useState<any>(null);

  useEffect(() => {
    if (transaction?.startTime && transaction?.timeSlots) {
      const startTime = moment(transaction.startTime, 'YYYY/MM/DD HH:mm:ss');

      const updateTimer = () => {
        const now = moment();
        setElapsedTime(now.diff(startTime, 'seconds'));

        const matchedSlot = transaction.timeSlots.find((slot) => {
          const start = moment(slot.startTime, 'HH:mm:ss');
          const end = moment(slot.endTime, 'HH:mm:ss');
          return now.isBetween(start, end, null, '[)');
        });

        setCurrentSlot(matchedSlot || null);
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [transaction]);

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  const handleEndGame = async () => {
    try {
      const { success, data, message } = await getGamePrice({
        gameId: transaction.gameId,
      });

      if (success) {
        navigate('/payment', {
          state: {
            type: 'gameEnd',
            payData: {
              gameId: transaction.gameId,
              poolTableId: transaction.poolTableId,
              gameData: data,
            },
            totalAmount: data.totalPrice,
          },
        });
      } else {
        openInfoDialog({
          title: '錯誤',
          content: message || '無法載入店家資訊',
        });
      }
    } catch (error: any) {
      openInfoDialog({ title: '錯誤', content: error.message || '發生錯誤' });
    }
  };

  const handleCall = async () => {
    const phoneNumber = transaction?.storePhone;
    if (phoneNumber) {
      const confirmed = await openConfirmDialog({
        title: '撥打電話',
        content: `確定要撥打 ${phoneNumber} 嗎？`,
      });
      if (confirmed) {
        window.location.href = `tel:${phoneNumber}`;
      }
    } else {
      openInfoDialog({ title: '錯誤', content: '找不到電話號碼' });
    }
  };

  return (
    <div className="contact">
      <div
        className={`contact__timer contact__timer--${
          currentSlot?.isDiscount ? 'discount' : 'normal'
        }`}
      >
        {currentSlot && (
          <div className="contact__rate">
            <span>
              {currentSlot.isDiscount ? '優惠時段：' : '一般時段：'}
              <NumberFormatter number={60 * currentSlot.rate} /> 元/小時
            </span>
          </div>
        )}
        <div className="contact__elapsed">
          <span>球局已進行</span>
          <div className="contact__time-box">
            {String(hours).padStart(2, '0')}
          </div>
          <span>小時</span>
          <div className="contact__time-box">
            {String(minutes).padStart(2, '0')}
          </div>
          <span>分</span>
          <div className="contact__time-box">
            {String(seconds).padStart(2, '0')}
          </div>
          <span>秒</span>
        </div>
      </div>

      <div className="contact__info">
        <div className="contact__call">
          <button className="contact__call-button" onClick={handleCall}>
            <span className="contact__call-icon">📞</span>
            聯絡加盟商
          </button>
        </div>
        <div className="contact__text">
          <p>機台操作問題，請聯繫 {transaction?.vendorName} 加盟商！</p>
          <p>聯絡資訊 {transaction?.storePhone}</p>
        </div>
      </div>

      <div className="contact__hint">
        <strong>溫馨提示：</strong>
        <p>{transaction?.hint}</p>
      </div>

      <button className="contact__end-button" onClick={handleEndGame}>
        結束球局
      </button>
    </div>
  );
};

export default Contact;
