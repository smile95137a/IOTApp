import React from 'react';

type TimeSlotStatus = 'selected' | 'available' | 'booked';

interface TimeSlotProps {
  start: string;
  end: string;
  rate: number;
  status: TimeSlotStatus;
  onPress?: () => void;
  onSelect?: () => void;
  onCancel?: () => void;
}

const TimeSlotSelector: React.FC<TimeSlotProps> = ({
  start,
  end,
  rate,
  status,
  onPress,
  onSelect,
  onCancel,
}) => {
  return (
    <div className={`timeslot timeslot--${status}`} onClick={onPress}>
      <div className="timeslot__time">{`${start} ~ ${end}`}</div>

      {status === 'available' && (
        <>
          <div className="timeslot__rate">{rate} 元/小時</div>
        </>
      )}

      {status === 'selected' && (
        <div className="timeslot__actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            預約
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
          >
            取消
          </button>
        </div>
      )}

      {status === 'booked' && <div className="timeslot__booked">已預約</div>}
    </div>
  );
};

export default TimeSlotSelector;
