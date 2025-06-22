import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import { useLoading } from '@/context/frontend/LoadingContext';
import { getErrorMessage } from '@/utils/errorUtils';
import { getAvailableTimes, checkIsUse } from '@/services/frontend/gameService';
import { useDialog } from '@/context/DialogContext';
import TimeSlotSelector from '@/components/frontend/TimeSlotSelector';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Step3SelectTime: React.FC = () => {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { openConfirmDialog, openInfoDialog } = useDialog();

  const store = useSelector(
    (state: RootState) => state.frontend.bookingStep.store
  );
  const table = useSelector(
    (state: RootState) => state.frontend.bookingStep.table
  );
  const selectedDateStr = useSelector(
    (state: RootState) => state.frontend.bookingStep.selectedDate
  );
  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : new Date();

  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [activeTimeSlots, setActiveTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    if (store?.id && table?.id && selectedDateStr) {
      loadTimeSlots();
    }
  }, [store, table, selectedDateStr]);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      const { success, data } = await getAvailableTimes(
        store.id,
        formattedDate,
        table.id
      );
      if (success) {
        const slots =
          data[table.id]?.map((x: any) => ({
            ...x,
            id: Math.random().toString(36).substring(2, 10),
            rate: x.rate * 60,
          })) || [];
        setTimeSlots(slots);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
          poolTableUId: table.uid,
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

  if (!store || !table) return null;

  return (
    <div className="store-detail">
      <div className="store-detail__container">
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

export default Step3SelectTime;
