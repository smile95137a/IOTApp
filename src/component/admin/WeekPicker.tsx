import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  label: string;
  date: Date;
  setDate: (date: Date) => void;
  style?: any;
}

// 取得指定月份有幾個週（起始為週一）
const generateWeeksInMonth = (year: number, month: number) => {
  const weeks: { label: string; value: string }[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let current = new Date(firstDay);

  let weekIndex = 1;

  while (current <= lastDay) {
    const label = `${year}-${String(month + 1).padStart(
      2,
      '0'
    )} 第${weekIndex}週`;
    const value = `${year}-${String(month + 1).padStart(2, '0')}-W${weekIndex}`;
    weeks.push({ label, value });

    current.setDate(current.getDate() + 7);
    weekIndex++;
  }

  return weeks;
};

const WeekPicker = ({ label, date, setDate, style }: Props) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const weekOptions = generateWeeksInMonth(year, month);

  const selectedWeekIndex = Math.ceil(
    (date.getDate() + new Date(year, month, 1).getDay()) / 7
  );
  const selectedValue = `${year}-${String(month + 1).padStart(
    2,
    '0'
  )}-W${selectedWeekIndex}`;

  const handleChange = (value: string) => {
    const [y, m, wk] = value.split(/[-W]+/);
    const year = parseInt(y, 10);
    const month = parseInt(m, 10) - 1;
    const week = parseInt(wk, 10);

    const firstOfMonth = new Date(year, month, 1);
    const dateOffset = (week - 1) * 7;
    const targetDate = new Date(firstOfMonth);
    targetDate.setDate(1 + dateOffset);
    setDate(targetDate);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        value={selectedValue}
        onValueChange={handleChange}
        items={weekOptions}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
          iconContainer: styles.iconContainer,
        }}
        Icon={() => (
          <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
        )}
        useNativeAndroidPickerStyle={false}
        placeholder={{ label: '選擇週次', value: '' }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    color: '#000',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
});

export default WeekPicker;
