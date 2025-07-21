import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { getImageUrl } from '@/utils/ImageUtils';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import tableDisableImg from '@/assets/image/iot-table-disable.png';
import NumberFormatter from '@/components/common/NumberFormatter';
import { fetchPoolTablesByStoreUid } from '@/services/frontend/poolTableService';
import { fetchStoreByUid } from '@/services/frontend/storeService';
import { startGame } from '@/services/frontend/gameService';
import { useDialog } from '@/context/DialogContext';
import { getErrorMessage } from '@/utils/errorUtils';

const StoreDetailScreen: React.FC = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentRegularSlot, setCurrentRegularSlot] = useState<any>(null);
  const [currentDiscountSlot, setCurrentDiscountSlot] = useState<any>(null);
  const { openConfirmDialog, openInfoDialog } = useDialog();
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
      const currentSlot = today.timeSlots[0];

      setTodayPricing({
        regularRate: today.regularRate,
        discountRate: today.discountRate,
      });

      setCurrentDiscountSlot({
        startTime: currentSlot.startTime,
        endTime: currentSlot.endTime,
      });

      setCurrentRegularSlot({
        startTime: today.openTime,
        endTime: today.closeTime,
      });
    }
  };

  const loadTables = async () => {
    const res = await fetchPoolTablesByStoreUid(storeId!);
    setTables(res.data);
  };

  if (!store) return null;

  const available = tables.filter((t) => !t.isUse).length;

  const handleStartGame = async (poolTableUid: string) => {
    try {
      const payType = 'game';
      const result = await startGame({ poolTableUId: poolTableUid, payType });
      if (result.success) {
        if (result.data) {
          await openInfoDialog({
            title: '系統訊息',
            content: '開局成功',
            confirmText: '我知道了',
          });
          navigate('/member-center/game-ongoing');
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: result.message || '開局失敗，請稍後再試',
          });
        }
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: result.message || '開局失敗，請稍後再試',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };
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
                  {currentRegularSlot?.startTime} -{currentRegularSlot?.endTime}
                </p>
              </div>
              <div>
                <p className="store-detail__price-main">
                  <NumberFormatter number={todayPricing.discountRate * 60} />
                  元/小時
                </p>
                <p className="store-detail__price-sub">優惠時段</p>
                <p className="store-detail__price-time">
                  {currentDiscountSlot
                    ? `${currentDiscountSlot.startTime} - ${currentDiscountSlot.endTime}`
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
            const isReserved = table.isUse;
            const isFault =
              table.status === 'FAULT' || table.status === 'UNAVAILABLE';

            const status = isFault
              ? 'fault'
              : isReserved
              ? 'reserved'
              : 'available';
            const label = isFault
              ? '設備維護中'
              : isReserved
              ? '開局進行中'
              : '立即開台';
            return (
              <div
                key={table.id}
                className="store-detail__table-item"
                onClick={() => handleStartGame(table.uid)}
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
