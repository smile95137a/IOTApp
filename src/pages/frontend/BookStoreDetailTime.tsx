import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { fetchStoreByUid } from '@/services/frontend/storeService';
import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { fetchPoolTablesByStoreUid } from '@/services/frontend/poolTableService';
import { checkIsUse, getAvailableTimes } from '@/services/frontend/gameService';
import { getImageUrl } from '@/utils/ImageUtils';
import TimeSlotSelector from '@/components/frontend/TimeSlotSelector';
import { useDialog } from '@/context/DialogContext';

const StoreDetailScreen: React.FC = () => {
  const { storeId, sId, tableId, tableUid, sdate } = useParams();
  const navigate = useNavigate();
  const { openConfirmDialog, openInfoDialog } = useDialog();
  const { setLoading } = useLoading();

  const [store, setStore] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [todayPricing, setTodayPricing] = useState<any>(null);
  const [currentSlot, setCurrentSlot] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [activeTimeSlots, setActiveTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    loadStore();
    loadTables();
  }, [storeId]);

  useEffect(() => {
    if (selectedDate && tableId && storeId) {
      loadTimeSlots();
    }
  }, [selectedDate]);

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

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = moment(sdate).format('YYYY-MM-DD');
      const { success, data } = await getAvailableTimes(
        sId,
        formattedDate,
        tableId
      );
      if (success) {
        const slots =
          data[tableId]?.map((x: any) => ({
            ...x,
            id: Math.random().toString(36).substring(2, 10),
            rate: x.rate * 60,
          })) || [];
        setTimeSlots(slots);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
    }
  };

  if (!store) return null;

  const handleToggleSlot = (id: string) => {
    setActiveTimeSlots((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };
  const checkIsContinuous = (selected: any[]) => {
    for (let i = 1; i < selected.length; i++) {
      const prevEnd = moment(selected[i - 1].end, 'HH:mm');
      const currentStart = moment(selected[i].start, 'HH:mm');
      if (!currentStart.isSame(prevEnd)) return false;
    }
    return true;
  };
  const handleConfirm = async () => {
    if (activeTimeSlots.length === 0) {
      await openInfoDialog({
        title: '請選擇時段',
        content: '請至少選擇一個時段進行預約',
      });
      return;
    }

    const selected = timeSlots
      .filter((slot) => activeTimeSlots.includes(slot.id))
      .sort((a, b) => moment(a.start, 'HH:mm').diff(moment(b.start, 'HH:mm')));

    if (!checkIsContinuous(selected)) {
      await openInfoDialog({
        title: '選取錯誤',
        content: '選取的時段不連續，請重新選擇',
      });
      return;
    }

    try {
      const { success, message } = await checkIsUse();
      if (!success) {
        await openInfoDialog({
          title: '預約限制',
          content: message || '今天已經有開放球局，不能預約當天',
        });
        return;
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
      return;
    }

    const confirmText = selected.map((s) => `${s.start} - ${s.end}`).join('\n');
    const confirmed = await openConfirmDialog({
      title: '確認預約',
      content: `確認預約以下時段？\n${confirmText}`,
    });

    if (!confirmed) return;

    navigate('/payment', {
      state: {
        type: 'bookGame',
        payData: {
          poolTableUId: tableUid,
          bookDate: moment(selectedDate).format('YYYY-MM-DD'),
          selectedTime: selected,
        },
        totalAmount: selected.reduce(
          (sum, s) => sum + (s.rate || store.deposit),
          0
        ),
      },
    });
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
        </div>

        <div className="store-detail__slots">
          <h3 className="store-detail__slots-title">可預約時段</h3>
          {timeSlots.length === 0 ? (
            <p className="store-detail__slots-empty">此日無可預約時段</p>
          ) : (
            <div className="slots">
              {timeSlots.map((slot) => {
                const isSelected = activeTimeSlots.includes(slot.id);
                const status =
                  slot.status === 'booked'
                    ? 'booked'
                    : isSelected
                    ? 'selected'
                    : 'available';

                return (
                  <TimeSlotSelector
                    key={slot.id}
                    start={slot.start}
                    end={slot.end}
                    rate={slot.rate}
                    status={status}
                    onPress={() => handleToggleSlot(slot.id)}
                    onSelect={handleConfirm}
                    onCancel={() => handleToggleSlot(slot.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailScreen;
