import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { fetchStoreByUid } from '@/services/frontend/storeService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { fetchPoolTablesByStoreUid } from '@/services/frontend/poolTableService';
import { getImageUrl } from '@/utils/ImageUtils';

const StoreDetailScreen: React.FC = () => {
  const { storeId, sId, tableId, tableUid } = useParams();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [store, setStore] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    loadStore();
    loadTables();
  }, [storeId]);

  const loadStore = async () => {
    try {
      setLoading(true);
      const res = await fetchStoreByUid(storeId);
      setStore(res.data);

      const today = res.data.todayRes;
      if (today) {
        const now = moment();
        const slot = today.timeSlots.find((t) =>
          now.isBetween(
            moment(t.startTime, 'HH:mm'),
            moment(t.endTime, 'HH:mm')
          )
        );
        setTodayPricing(today);
        setCurrentSlot(slot);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      const { data } = await fetchPoolTablesByStoreUid(storeId);
      setTables(data);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  if (!store) return null;

  return (
    <div className="store-detail">
      <div className="store-detail__container">
        <div className="store-detail__header">
          <img
            src={getImageUrl(store.imgUrl)}
            alt=""
            className="store-detail__avatar"
          />
          <div className="store-detail__info">
            <h2 className="store-detail__name">{store.name}</h2>
            <p className="store-detail__address">{store.address}</p>
          </div>
        </div>

        <div className="store-detail__pricing">
          <div className="store-detail__pricing-box">
            <p className="store-detail__pricing-label">一般時段</p>
            <p className="store-detail__pricing-value">
              {todayPricing?.regularRate * 60} 元/小時
            </p>
          </div>
          <div className="store-detail__pricing-box">
            <p className="store-detail__pricing-label">優惠時段</p>
            <p className="store-detail__pricing-value">
              {currentSlot
                ? currentSlot.price * 60
                : todayPricing?.regularRate * 60}{' '}
              元/小時
            </p>
          </div>
        </div>

        <div className="store-detail__calendar">
          <h3 className="store-detail__calendar-title">選擇日期</h3>
          <Calendar
            onChange={(value) => {
              const date = moment(value as Date).format('YYYY-MM-DD');
              if (storeId && tableId) {
                navigate(
                  `/book-store-detail-time/${storeId}/${sId}/${tableId}/${tableUid}/${date}`
                );
              }
            }}
            value={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default StoreDetailScreen;
