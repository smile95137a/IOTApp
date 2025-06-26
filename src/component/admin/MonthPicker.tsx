import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyDropdown } from '../MyDropdown';

interface Props {
  label: string;
  date: Date;
  setDate: (date: Date) => void;
  style?: any;
}

const MonthPicker = ({ label, date, setDate, style }: Props) => {
  const currentYear = new Date().getFullYear();

  // 建立近三年內月份選項：YYYY-MM
  const months = [];
  for (let y = currentYear; y >= currentYear - 2; y--) {
    for (let m = 1; m <= 12; m++) {
      const value = `${y}-${String(m).padStart(2, '0')}`;
      months.push({ label: value, value });
    }
  }

  const selectedValue = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}`;

  const handleChange = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    const newDate = new Date(date);
    newDate.setFullYear(year);
    newDate.setMonth(month - 1);
    setDate(newDate);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.formGroup}>
        <MyDropdown
          value={selectedValue}
          onChange={handleChange}
          items={months}
          zIndex={3000}
        />
      </View>
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
  formGroup: {
    marginBottom: 32,
  },
});

export default MonthPicker;
