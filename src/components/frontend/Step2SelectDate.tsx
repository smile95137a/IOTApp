import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setSelectedDate,
  setStep,
} from '@/store/slices/frontend/bookingStepSlice';
import moment from 'moment';

const Step2SelectDate = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(
    (state: RootState) => state.frontend.bookingStep.selectedDate
  );
  const table = useSelector(
    (state: RootState) => state.frontend.bookingStep.table
  );

  const handleDateChange = (date: Date) => {
    dispatch(setSelectedDate(moment(date).format('YYYY-MM-DD')));
    dispatch(setStep(3));
  };

  return (
    <div className="store-picker">
      <div className="store-picker__card">
        <div className="store-picker__top">
          <div className="store-picker__table-label">
            桌台｜{table?.tableNumber ?? '未選擇'}
          </div>
        </div>

        <hr className="store-picker__divider" />

        <div className="store-picker__calendar-wrapper">
          <p className="store-picker__calendar-label">選擇日期</p>
          <Calendar
            value={selectedDate ? new Date(selectedDate) : new Date()}
            onChange={(date) => handleDateChange(date as Date)}
            className="store-picker__calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default Step2SelectDate;
