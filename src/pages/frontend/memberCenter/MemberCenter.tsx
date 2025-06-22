import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import avatarImg from '@/assets/image/iot-girl.png';
import {
  FaBell,
  FaCalendarAlt,
  FaMoneyBill,
  FaHistory,
  FaCoins,
  FaReceipt,
  FaUser,
  FaWallet,
  FaComments,
  FaGamepad,
} from 'react-icons/fa';
import { MdCreditCard } from 'react-icons/md';

const menus = [
  { icon: <FaUser />, label: '編輯會員', path: '/member-center/profile-edit' },
  {
    icon: <FaComments />,
    label: '訊息通知',
    path: '/member-center/notifications',
  },
  {
    icon: <FaCoins />,
    label: '消費紀錄',
    path: '/member-center/transaction-history',
  },
  {
    icon: <FaWallet />,
    label: '儲值紀錄',
    path: '/member-center/deposit-history',
  },
  {
    icon: <FaGamepad />,
    label: '開局進行中',
    path: '/member-center/game-ongoing',
  },
  {
    icon: <FaHistory />,
    label: '開局記錄',
    path: '/member-center/game-history',
  },
  { icon: <FaWallet />, label: '儲值', path: '/deposit' },
  {
    icon: <FaReceipt />,
    label: '我的預約',
    path: '/member-center/my-book-history',
  },
];

const MemberCenter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="member">
      <h2 className="member__title">會員中心</h2>

      <div className="member__card">
        <div className="member__top">
          <img src={avatarImg} alt="avatar" className="member__avatar" />
          <div className="member__profile">
            <h3 className="member__name">Allan</h3>
            <p className="member__balance">餘額：1,360元</p>
          </div>
        </div>

        <div className="member__body">
          <div className="member__sidebar">
            {menus.map((item, idx) => (
              <div
                key={idx}
                className={`member__menu-item ${
                  location.pathname === item.path
                    ? 'member__menu-item--active'
                    : ''
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="member__menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="member__content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCenter;
