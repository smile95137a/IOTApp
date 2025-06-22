import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import storeImg from '@/assets/image/iot-boy.png';

const StoreDatePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="store-picker">
      <div className="store-picker__header">
        <img src={storeImg} alt="store" className="store-picker__image" />
        <div className="store-picker__info">
          <h2 className="store-picker__name">板橋文化旗艦店</h2>
          <p className="store-picker__address">新北市板橋區文化路一段280號B1</p>
        </div>
        <div className="store-picker__share">🔗</div>
      </div>

      <div className="store-picker__card">
        <div className="store-picker__top">
          <div className="store-picker__table-label">桌台｜2</div>
          <div className="store-picker__pricing">
            <div className="store-picker__pricing-item">
              <div className="store-picker__pricing-title">時段計費</div>
              <div className="store-picker__pricing-detail">
                <p className="store-picker__price-main">100元/小時</p>
                <p className="store-picker__price-time">
                  一般時段｜18:00–02:00
                </p>
              </div>
              <div className="store-picker__pricing-detail">
                <p className="store-picker__price-main">60元/小時</p>
                <p className="store-picker__price-time">
                  優惠時段｜08:00–18:00
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="store-picker__divider" />

        <div className="store-picker__calendar-wrapper">
          <p className="store-picker__calendar-label">選擇日期</p>
          <Calendar
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            className="store-picker__calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreDatePicker;
