import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaComments,
  FaCoins,
  FaWallet,
  FaGamepad,
  FaHistory,
  FaReceipt,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';
import NumberFormatter from '@/components/common/NumberFormatter';
import girlAvatar from '@/assets/image/iot-girl.png';
import boyAvatar from '@/assets/image/iot-boy.png';
import { RootState } from '@/store';
import { useDialog } from '@/context/DialogContext';
import { setUser } from '@/store/slices/frontend/authSlice';
import { getErrorMessage } from '@/utils/errorUtils';
import { getUserInfo } from '@/services/frontend/userService';

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
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();

  const user = useSelector((state: RootState) => state.frontend.auth.user);

  // local 狀態（即使 redux 有 user，也可以支援數值動畫或強制刷新）
  const [userBalance, setUserBalance] = useState(0); // 儲值金額
  const [userBonus, setUserBonus] = useState(0); // 可用餘額
  const [userSliver, setUserSliver] = useState(0); // 贈送點數

  const fetchAndSetUserInfo = async () => {
    try {
      const response = await getUserInfo();
      const { success, data, message } = response;

      if (success) {
        dispatch(setUser(data));
        setUserBalance(data.amount || 0);
        setUserSliver(data.point || 0);
        setUserBonus(data.balance || 0);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '取得會員資料失敗',
        });
      }
    } catch (error: any) {
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    fetchAndSetUserInfo();
  }, []);

  return (
    <div className="member">
      <h2 className="member__title">會員中心</h2>

      <div className="member__card">
        {/* 使用者頭像與資訊 */}
        <div className="member__top">
          <img
            src={
              user?.imgUrl
                ? getImageUrl(user.imgUrl)
                : user?.gender === 'female'
                ? girlAvatar
                : boyAvatar
            }
            alt="avatar"
            className="member__avatar"
          />
          <div className="member__profile">
            <h3 className="member__name">
              {user?.anonymousId || user?.name || '未登入'}
            </h3>
            <p className="member__balance">
              儲值金額：
              <NumberFormatter number={userBalance} />
              （消費優先扣除）
            </p>
            <p className="member__balance">
              贈送：
              <NumberFormatter number={userSliver} />
            </p>
            <p className="member__balance">
              可用餘額：
              <NumberFormatter number={userBonus} /> 元
            </p>
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
