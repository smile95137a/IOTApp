import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { getImageUrl } from '@/utils/ImageUtils';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import tableDisableImg from '@/assets/image/iot-table-disable.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { fetchPoolTablesByStoreUid } from '@/services/frontend/poolTableService';
import { fetchStoreByUid } from '@/services/frontend/storeService';

const StoreDetailScreen: React.FC = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentSlot, setCurrentSlot] = useState<any>(null);

  useEffect(() => {
    if (storeId) {
      loadStore();
      loadTables();
    }
  }, [storeId]);

  const loadStore = async () => {
    const res = await fetchStoreByUid(storeId!);
    const storeData = res.data;
    setStore(storeData);

    const today = storeData.todayRes;
    if (today) {
      const now = moment();
      const slot = today.timeSlots.find((t: any) =>
        now.isBetween(moment(t.startTime, 'HH:mm'), moment(t.endTime, 'HH:mm'))
      );
      setTodayPricing(today);
      setCurrentSlot(slot);
    }
  };

  const loadTables = async () => {
    const res = await fetchPoolTablesByStoreUid(storeId!);
    setTables(res.data);
  };

  if (!store) return null;

  const available = tables.filter((t) => !t.isUse).length;

  return (
    <div className="store-detail">
      <div className="store-detail__header">
        <img
          className="store-detail__logo"
          src={getImageUrl(store.imgUrl)}
          alt="store"
        />
        <div className="store-detail__info">
          <h2 className="store-detail__title">{store.name}</h2>
          <p className="store-detail__address">{store.address}</p>
        </div>
      </div>

      <div className="store-detail__card">
        <div className="store-detail__price">
          <div className="store-detail__price-block">
            <p className="store-detail__price-label">時段計費</p>
            <div className="store-detail__price-detail">
              <div>
                <p className="store-detail__price-main">
                  <NumberFormatter number={todayPricing?.regularRate * 60} />
                  元/小時
                </p>
                <p className="store-detail__price-sub">一般時段</p>
                <p className="store-detail__price-time">
                  {todayPricing?.openTime} - {todayPricing?.closeTime}
                </p>
              </div>
              <div>
                <p className="store-detail__price-main">
                  <NumberFormatter number={currentSlot?.price * 60 ?? 0} />
                  元/小時
                </p>
                <p className="store-detail__price-sub">優惠時段</p>
                <p className="store-detail__price-time">
                  {currentSlot
                    ? `${currentSlot.startTime} - ${currentSlot.endTime}`
                    : '目前無優惠時段'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <hr className="store-detail__divider" />

        <div className="store-detail__table-summary">
          <p>桌數：{tables.length}桌</p>
          <p className="store__table-available">可用桌數：{available}桌</p>
        </div>

        <div className="store-detail__table-grid">
          {tables.map((table) => {
            const status =
              table.status === 'FAULT'
                ? 'fault'
                : table.isUse
                ? 'reserved'
                : 'available';
            const label =
              status === 'fault'
                ? '設備維護中'
                : status === 'reserved'
                ? '開局進行中'
                : '立即開台';

            return (
              <div
                key={table.id}
                className="store-detail__table-item"
                onClick={() => {
                  if (status === 'available') {
                    navigate(`/reservation?tableUid=${table.uid}`);
                  }
                }}
              >
                <img
                  src={
                    status === 'available' ? tableEnableImg : tableDisableImg
                  }
                  alt={table.name}
                  className="store-detail__table-img"
                />
                <div
                  className={`store-detail__table-btn ${
                    status === 'available'
                      ? 'store-detail__table-btn--yellow'
                      : 'store-detail__table-btn--gray'
                  }`}
                >
                  {table.tableNumber} {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailScreen;
