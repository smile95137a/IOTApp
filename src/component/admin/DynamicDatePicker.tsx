import React, { useEffect } from 'react';
import DatePickerComponent from '@/component/DatePickerComponent';
import MonthPicker from './MonthPicker';
import WeekPicker from './WeekPicker';
import YearPicker from './YearPicker';

interface Props {
  periodType: string;
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  style?: any;
}

const DynamicDatePicker = ({
  periodType,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  style,
}: Props) => {
  useEffect(() => {
    if (periodType === 'WEEK') {
      const autoEnd = new Date(startDate);
      autoEnd.setDate(startDate.getDate() + 7);
      setEndDate(autoEnd);
    }
  }, [periodType, startDate]);

  if (periodType === 'WEEK') {
    return (
      <DatePickerComponent
        label="開始日期"
        date={startDate}
        setDate={setStartDate}
        style={style}
      />
    );
  }

  if (periodType === 'MONTH') {
    return (
      <MonthPicker
        label="月份"
        date={startDate}
        setDate={setStartDate}
        style={style}
      />
    );
  }

  if (periodType === 'YEARS') {
    return (
      <YearPicker
        label="年份"
        date={startDate}
        setDate={setStartDate}
        style={style}
      />
    );
  }

  return (
    <>
      <DatePickerComponent
        label="開始日期"
        date={startDate}
        setDate={setStartDate}
        style={style}
      />
      <DatePickerComponent
        label="結束日期"
        date={endDate}
        setDate={setEndDate}
        style={style}
      />
    </>
  );
};

export default DynamicDatePicker;
