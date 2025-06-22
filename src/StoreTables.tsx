import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import tableDisableImg from '@/assets/image/iot-table-disable.png';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import { useDialog } from '@/context/DialogContext';
import { useLoading } from './context/frontend/LoadingContext';
import { fetchPoolTablesByStoreUid } from './services/frontend/poolTableService';
import { fetchStoreByUid } from './services/frontend/storeService';

const StoreDetailScreen: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      const { data } = await fetchPoolTablesByStoreUid(storeId);
      setTables(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!store) return null;

  const total = tables.length;
  const available = tables.filter((t) => t.status === 'available').length;

  return (
    <div className="store-detail">
      <div className="store-detail__header">
        <img className="store-detail__logo" src={tableDisableImg} alt="Logo" />
        <div className="store-detail__info">
          <h2 className="store-detail__title">{store.name}</h2>
          <p className="store-detail__address">{store.address}</p>
        </div>
      </div>

      <div className="store-detail__card">
        <div className="store-detail__pricing">
          <div className="store-detail__pricing-block">
            <p className="store-detail__label">時段計費</p>
            <div className="store-detail__pricing-detail">
              {todayPricing?.timeSlots?.map((slot: any, index: number) => (
                <div key={index}>
                  <p className="store-detail__price">{slot.price}元/小時</p>
                  <p className="store-detail__type">
                    {slot.isDiscount ? '優惠時段' : '一般時段'}
                  </p>
                  <p className="store-detail__time">
                    {moment(slot.startTime, 'HH:mm').format('HH:mm')}~
                    {moment(slot.endTime, 'HH:mm').format('HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="store-detail__buttons">
            <button className="store-detail__button">📢 {store.name}</button>
            <button className="store-detail__button store-detail__button--secondary">
              最新消息
            </button>
          </div>
        </div>

        <hr className="store-detail__divider" />

        <div className="store-detail__table-summary">
          <p className="store-detail__count">桌數：{total} 桌</p>
          <p className="store-detail__available">可用桌數：{available} 桌</p>
        </div>

        <div className="store-detail__table-grid">
          {tables.map((t) => (
            <div key={t.id} className="store-detail__table-item">
              <img
                src={
                  t.status === 'available' ? tableEnableImg : tableDisableImg
                }
                alt={t.name}
                className="store-detail__table-img"
              />
              <div
                className={`store-detail__table-btn ${
                  t.status === 'available'
                    ? 'store-detail__table-btn--yellow'
                    : 'store-detail__table-btn--gray'
                }`}
              >
                {t.name} {t.status === 'available' ? '立即開台' : '已預訂'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailScreen;
