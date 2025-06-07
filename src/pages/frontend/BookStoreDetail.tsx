import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { fetchStoreByUid } from '@/services/frontend/storeService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { fetchPoolTablesByStoreUid } from '@/services/frontend/poolTableService';
import { getImageUrl } from '@/utils/ImageUtils';

const StoreDetailScreen: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const [store, setStore] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentSlot, setCurrentSlot] = useState<any>(null);

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
  const handleTableClick = (tableItem: any, status: string) => {
    navigate(
      `/book-store-detail-date/${storeId}/${store.id}/${tableItem.id}/${tableItem.uid}`
    );
  };

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
              {todayPricing.regularRate * 60} 元/小時
            </p>
          </div>
          <div className="store-detail__pricing-box">
            <p className="store-detail__pricing-label">優惠時段</p>
            <p className="store-detail__pricing-value">
              {currentSlot
                ? currentSlot.price * 60
                : todayPricing.regularRate * 60}{' '}
              元/小時
            </p>
          </div>
        </div>

        <div className="store-detail__table-area">
          <h3 className="store-detail__section-title">
            桌台資訊（共 {tables.length} 桌）
          </h3>
          <div className="store-detail__table-grid">
            {tables.map((t) => {
              const status =
                t.status === 'FAULT' ? 'fault' : t.isUse ? 'used' : 'available';
              const label =
                status === 'fault'
                  ? '設備維護中'
                  : status === 'used'
                  ? '開局進行中'
                  : '立即開台';

              return (
                <div
                  key={t.id}
                  className={`store-detail__table-card store-detail__table-card--available`}
                  onClick={() => handleTableClick(t, status)}
                  style={{
                    cursor: status === 'available' ? 'pointer' : 'default',
                  }}
                >
                  <img
                    src={`/images/iot-table-${status}.png`}
                    className="store-detail__table-img"
                    alt=""
                  />
                  <div className="store-detail__table-info">
                    <span className="store-detail__table-id">
                      #{t.tableNumber}
                    </span>
                    <span className="store-detail__table-label">{label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailScreen;
