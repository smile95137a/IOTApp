import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NumberFormatter from '@/components/common/NumberFormatter';
import { fetchRechargeStandards } from '@/services/frontend/rechargeStandardService';
import { useDialog } from '@/context/DialogContext';
import { getUserUse, topUp } from '@/services/frontend/paymentService';

const RechargeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { openInfoDialog } = useDialog();

  const [selectedOptionId, setSelectedOptionId] = useState<
    number | string | null
  >(null);
  const [rechargeOptions, setRechargeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstUse, setFirstUse] = useState(true);
  const [sendUse, setSendUse] = useState(true);

  const allFirstTimeOptions = [
    {
      id: 'first_recharge',
      rechargeAmount: 300,
      bonusAmount: 150,
      title: '首次儲值限定',
      tag: '首次儲值限定',
    },
    {
      id: 'first_member',
      rechargeAmount: 100,
      bonusAmount: 0,
      title: '首次會員優惠',
      tag: '首次會員優惠',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rechargeData, userUseResp] = await Promise.all([
          fetchRechargeStandards(),
          getUserUse(),
        ]);

        const usedData = userUseResp?.data || {};
        setFirstUse(!usedData.firstUse);
        setSendUse(!usedData.sendUse);

        const availableOptions = (rechargeData || [])
          .filter((item) => item.status === 'AVAILABLE')
          .sort((a, b) => b.rechargeAmount - a.rechargeAmount);

        const firstTimeAvailableOptions = [];

        if (!usedData.firstUse)
          firstTimeAvailableOptions.push(allFirstTimeOptions[0]);
        if (!usedData.sendUse)
          firstTimeAvailableOptions.push(allFirstTimeOptions[1]);

        setRechargeOptions([...firstTimeAvailableOptions, ...availableOptions]);
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

  const handleSelect = (id: number | string) => {
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

    let isFirst = false;
    let sendType = 'dep';

    if (selected.id === 'first_recharge' && firstUse) {
      isFirst = true;
      sendType = 'dep';
    } else if (selected.id === 'first_member' && sendUse) {
      isFirst = true;
      sendType = 'send';
    }

    // 若是 first_member 且送點立即入帳（跳過付款流程）
    if (selected.id === 'first_member' && sendUse) {
      try {
        await topUp({
          price: selected.rechargeAmount,
          payType: 1, // 預設使用儲值金入帳
          point: selected.bonusAmount,
          isFirst,
          sendType,
        });

        navigate('/payment-success', {
          state: {
            totalAmount: selected.rechargeAmount,
          },
        });
      } catch (err) {
        await openInfoDialog({
          title: '錯誤',
          content: '儲值失敗，請稍後再試',
        });
      }
      return;
    }

    // 其餘跳轉至付款頁
    navigate('/payment', {
      state: {
        type: 'recharge',
        totalAmount: selected.rechargeAmount,
        rechargeOption: {
          ...selected,
          isFirst,
          sendType,
        },
      },
    });
  };

  return (
    <div className="recharge">
      <div className="recharge__container">
        <h2 className="recharge__title">選擇儲值方案</h2>

        {loading ? (
          <div className="recharge__loading">載入中...</div>
        ) : (
          <div className="recharge__grid">
            {rechargeOptions.map((item) => {
              const isSelected = selectedOptionId === item.id;
              return (
                <div
                  key={item.id}
                  className={`recharge__card ${
                    isSelected ? 'recharge__card--selected' : ''
                  }`}
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="recharge__card-content">
                    {item.tag && (
                      <div className="recharge__tag">{item.tag}</div>
                    )}
                    <div className="recharge__option-amount">
                      {item.id === 'first_member' ? (
                        '贈送儲值金額 100元'
                      ) : (
                        <>
                          儲值 <NumberFormatter number={item.rechargeAmount} />{' '}
                          元
                        </>
                      )}
                    </div>
                    <div className="recharge__option-bonus">
                      {item.id !== 'first_member' && (
                        <>
                          送 <NumberFormatter number={item.bonusAmount} /> 元
                        </>
                      )}
                    </div>
                    {isSelected && (
                      <div className="recharge__card-check">✓</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button className="recharge__submit" onClick={handleRecharge}>
          儲值
        </button>
      </div>
    </div>
  );
};

export default RechargeScreen;
