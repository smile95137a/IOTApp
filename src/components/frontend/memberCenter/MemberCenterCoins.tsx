import React, { useEffect, useState } from 'react';
import { FaCoins, FaStar, FaGift } from 'react-icons/fa'; // 導入對應 icon
import NumberFormatter from '@/components/common/NumberFormatter';
import { getUserInfo } from '@/services/frontend/userService';

const MemberCenterCoins = () => {
  const [userBalance, setUserBalance] = useState(0); // 代幣
  const [userBonus, setUserBonus] = useState(0); // 紅利
  const [userSliver, setUserSliver] = useState(0); // 點數

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      const { success, data, message } = response;

      if (success) {
        setUserBalance(data.amount || 0);
        setUserSliver(data.point || 0);
        setUserBonus(data.balance || 0);
      } else {
        console.error(`獲取用戶信息失敗：${message || '未知錯誤'}`);
      }
    } catch (error) {
      console.error('獲取用戶信息時發生錯誤：', error.message || '請稍後再試');
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="memberCenter__coins">
      <div className="memberCenter__coins-item memberCenter__coins-item--gold">
        <div className="memberCenter__coins-info">
          <div className="memberCenter__coins-icon">
            <FaCoins size={24} color="#FFD700" /> {/* 金幣色 */}
          </div>
          <div className="memberCenter__coins-title">
            <p className="memberCenter__text">儲值金額</p>
          </div>
        </div>
        <div className="memberCenter__coins-num">
          <p className="memberCenter__text">
            <NumberFormatter number={userBalance} />
          </p>
        </div>
      </div>

      <div className="memberCenter__coins-item memberCenter__coins-item--sliver">
        <div className="memberCenter__coins-info">
          <div className="memberCenter__coins-icon">
            <FaStar size={24} color="#C0C0C0" /> {/* 銀色星星 */}
          </div>
          <div className="memberCenter__coins-title">
            <p className="memberCenter__text">贈送</p>
          </div>
        </div>
        <div className="memberCenter__coins-num">
          <p className="memberCenter__text">
            <NumberFormatter number={userSliver} />
          </p>
        </div>
      </div>

      <div className="memberCenter__coins-item memberCenter__coins-item--bonus">
        <div className="memberCenter__coins-info">
          <div className="memberCenter__coins-icon">
            <FaGift size={24} color="#FF69B4" /> {/* 紅利禮物 */}
          </div>
          <div className="memberCenter__coins-title">
            <p className="memberCenter__text">可用餘額</p>
          </div>
        </div>
        <div className="memberCenter__coins-num">
          <p className="memberCenter__text">
            <NumberFormatter number={userBonus} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberCenterCoins;
