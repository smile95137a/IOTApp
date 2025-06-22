import React from 'react';
import avatarImg from '@/assets/image/iot-girl.png';
import { FaBell, FaCalendarAlt, FaMoneyBill, FaHistory } from 'react-icons/fa';
import { MdCreditCard, MdTableRestaurant } from 'react-icons/md';

const menu = [
  { icon: <FaBell />, label: '訊息通知' },
  { icon: <MdTableRestaurant />, label: '消費記錄' },
  { icon: <MdCreditCard />, label: '儲值記錄' },
  { icon: <FaHistory />, label: '開局記錄' },
  { icon: <FaMoneyBill />, label: '儲值' },
  { icon: <FaCalendarAlt />, label: '我的預約' },
];

const records = [
  {
    date: '2024.6.12 16:00',
    store: '板橋旗艦店',
    table: '桌台2',
    time: '16:00~18:00',
    status: '已結束',
  },
  {
    date: '2024.6.12 16:00',
    store: '板橋旗艦店',
    table: '桌台2',
    time: '16:00~18:00',
    status: '已結束',
  },
  {
    date: '2024.6.12 16:00',
    store: '板橋旗艦店',
    table: '桌台2',
    time: '16:00~18:00',
    status: '已結束',
  },
  {
    date: '2024.6.12 16:00',
    store: '板橋旗艦店',
    table: '桌台2',
    time: '16:00~18:00',
    status: '已取消',
  },
];

const MemberCenter: React.FC = () => {
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
            {menu.map((item, idx) => (
              <div key={idx} className="member__menu-item">
                <span className="member__menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="member__records">
            {records.map((r, idx) => (
              <div key={idx} className="member__record">
                <div className="member__record-info">
                  <p className="member__record-date">{r.date}</p>
                  <p className="member__record-store">{r.store}</p>
                  <p className="member__record-table">
                    <strong>{r.table}</strong> {r.time}
                  </p>
                </div>
                <p
                  className={`member__record-status ${
                    r.status === '已結束'
                      ? 'member__record-status--end'
                      : 'member__record-status--cancel'
                  }`}
                >
                  {r.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCenter;
