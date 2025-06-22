import React, { useEffect, useRef, useState } from 'react';
import logoImg from '@/assets/image/i-Pool_logo_RGB_2.png';
import { Link } from 'react-router-dom';
import { RiShieldStarLine, RiSmartphoneLine, RiUserLine } from 'react-icons/ri';
import {
  FaBullhorn,
  FaCog,
  FaBars,
  FaUserCircle,
  FaGift,
  FaDollarSign,
  FaHome,
  FaMapMarkerAlt,
  FaRegNewspaper,
  FaWallet,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { clearAuthData } from '@/store/slices/frontend/authSlice';
import { toggleSidebar } from '@/store/slices/frontend/uiSlice';
import { getUserInfo } from '@/services/frontend/userService';

import DropdownMenu from '../common/DropdownMenu';
import NumberFormatter from '../common/NumberFormatter';

const navItems = [
  {
    to: '/main',
    icon: <FaHome />,
    label: '首頁',
  },
  {
    to: '/store',
    icon: <FaMapMarkerAlt />,
    label: '門市探索',
  },
  {
    to: '/news',
    icon: <FaRegNewspaper />,
    label: '最新消息',
  },
  {
    to: '/deposit',
    icon: <FaWallet />,
    label: '儲值',
  },
];
const Header = () => {
  const [userBalance, setUserBalance] = useState(0);
  const [userBonus, setUserBonus] = useState(0);
  const [userSliver, setUserSliver] = useState(0);

  const dispatch = useDispatch();
  const isLogin = useSelector(
    (state: RootState) => state.frontend.auth.isLogin
  );

  const siddeBarIsOpen = useSelector(
    (state: RootState) => state.frontend.ui.sidebarOpen
  );

  const handleLogout = () => {
    dispatch(clearAuthData());
  };

  const handleToggle = () => {
    dispatch(toggleSidebar());
  };

  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo();
      const { success, data, message } = response;

      if (success) {
        setUserBalance(data.balance || 0);
        setUserBonus(data.bonus || 0);
        setUserSliver(data.sliverCoin || 0);
      } else {
        console.error(`獲取用戶信息失敗：${message || '未知錯誤'}`);
      }
    } catch (error: any) {
      console.error('獲取用戶信息時發生錯誤：', error.message || '請稍後再試');
    }
  };

  useEffect(() => {
    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

  return (
    <div className="fheader">
      <div className={`fheader__main `}>
        <div className="fheader__logo">
          <Link to="/main">
            <img src={logoImg} className="ffheader__logo-img" alt="Logo" />
          </Link>
        </div>
        <div className="fheader__menu" onClick={handleToggle}>
          <FaBars />
        </div>

        <div
          className={`fheader__nav ${
            siddeBarIsOpen ? 'fheader__nav--open' : ''
          }`}
          onClick={handleToggle}
        >
          <div className="fheader__nav-items">
            {navItems.map((item, index) => (
              <Link
                key={index}
                className={`fheader__nav-item `}
                to={item.to}
                onClick={(e) => {
                  if (window.location.pathname === item.to) {
                    e.preventDefault();
                    window.location.reload();
                  }
                }}
              >
                <div className={`fheader__nav-item-icon `}>{item.icon}</div>
                <span className={`fheader__nav-item-text`}>{item.label}</span>
              </Link>
            ))}

            {isLogin && (
              <>
                <div className="fheader__nav-item-divider"></div>
                <div className="fheader__nav-item fheader__nav-item--gold">
                  <div className="fheader__nav-item-icon"></div>
                  <NumberFormatter number={userBalance} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--sliver">
                  <div className="fheader__nav-item-icon"></div>
                  <NumberFormatter number={userSliver} />
                </div>
                <div className="fheader__nav-item fheader__nav-item--bonus">
                  <div className="fheader__nav-item-icon"></div>
                  <NumberFormatter number={userBonus} />
                </div>
                <Link
                  className="fheader__nav-item fheader__nav-item--member"
                  to="/member-center"
                >
                  <div className="fheader__nav-item-icon">
                    <RiUserLine />
                  </div>
                  會員中心
                </Link>
                <Link
                  className="fheader__nav-item fheader__nav-item--box"
                  to="/prizeBox"
                >
                  <div className="fheader__nav-item-icon">
                    <FaGift />
                  </div>
                  賞品盒
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="fheader__btns">
          {!isLogin ? (
            <Link className="fheader__btn fheader__btn--login" to="/login">
              登入/註冊
            </Link>
          ) : (
            <>
              <DropdownMenu
                links={[
                  {
                    label: '會員中心',
                    link: '/member-center',
                    className: 'custom-class-1',
                    icon: <FaUserCircle />,
                  },
                ]}
                className="header"
                icon={<FaUserCircle />}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
