import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberFormatter from '@/components/common/NumberFormatter';
import { fetchRechargeStandards } from '@/services/frontend/rechargeStandardService';
import { useDialog } from '@/context/DialogContext';

const RechargeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [rechargeOptions, setRechargeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRechargeStandards();
        const availableOptions = (data || [])
          .filter((item) => item.status === 'AVAILABLE')
          .sort((a, b) => b.rechargeAmount - a.rechargeAmount);
        setRechargeOptions(availableOptions);
      } catch {
        await openInfoDialog({
          title: '錯誤',
          content: '無法取得儲值方案，請稍後再試',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedOptionId(id);
  };

  const handleRecharge = async () => {
    const selected = rechargeOptions.find(
      (item) => item.id === selectedOptionId
    );
    if (!selected) {
      await openInfoDialog({
        title: '錯誤',
        content: '請選擇儲值金額',
      });
      return;
    }

    navigate('/payment', {
      state: {
        type: 'recharge',
        totalAmount: selected.rechargeAmount,
        rechargeOption: selected,
      },
    });
  };

  return (
    <div className="recharge">
      <h2 className="recharge__title">選擇儲值方案</h2>

      {loading ? (
        <div className="recharge__loading">載入中...</div>
      ) : (
        <div className="recharge__grid">
          {rechargeOptions.map((item) => (
            <div
              key={item.id}
              className={`recharge__option ${
                selectedOptionId === item.id ? 'recharge__option--selected' : ''
              }`}
              onClick={() => handleSelect(item.id)}
            >
              <span className="recharge__option-amount">
                儲值 <NumberFormatter number={~~item.rechargeAmount} /> 元
              </span>
              <span className="recharge__option-bonus">
                送 <NumberFormatter number={~~item.bonusAmount} /> 元
              </span>
              {selectedOptionId === item.id && (
                <span className="recharge__option-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}

      <button className="recharge__submit" onClick={handleRecharge}>
        儲值
      </button>
    </div>
  );
};

export default RechargeScreen;
