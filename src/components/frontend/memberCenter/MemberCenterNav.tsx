import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBell,
  FaGamepad,
  FaHistory,
  FaSignOutAlt,
  FaComments,
  FaTools,
  FaCoins,
  FaReceipt,
  FaUser,
  FaWallet,
} from 'react-icons/fa';
import { MdAdminPanelSettings } from 'react-icons/md'; // 特別使用 material icon

const navItems = [
  {
    path: '/member-center/profile-edit',
    icon: <FaUser />,
    label: '編輯會員',
  },
  {
    path: '/member-center/notifications',
    icon: <FaComments />,
    label: '訊息通知',
  },
  {
    path: '/member-center/transaction-history',
    icon: <FaCoins />,
    label: '消費紀錄',
  },
  {
    path: '/member-center/deposit-history',
    icon: <FaWallet />,
    label: '儲值紀錄',
  },
  {
    path: '/member-center/game-ongoing',
    icon: <FaGamepad />,
    label: '開局進行中',
  },
  {
    path: '/member-center/game-history',
    icon: <FaHistory />,
    label: '開局記錄',
  },
  {
    path: '/deposit',
    icon: <FaWallet />,
    label: '儲值',
  },
  {
    path: '/member-center/my-book-history',
    icon: <FaReceipt />,
    label: '我的預約',
  },
];

const MemberCenterNav = () => {
  return (
    <div className="memberCenter__nav">
      {navItems.map((item) => (
        <div className="memberCenter__nav-item" key={item.path}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `memberCenter__nav-link ${
                isActive ? 'memberCenter__nav-link--active' : ''
              }`
            }
          >
            <span className="memberCenter__nav-icon">{item.icon}</span>
            <span className="memberCenter__text">{item.label}</span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default MemberCenterNav;
