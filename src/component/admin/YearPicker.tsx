import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MyDropdown } from '../MyDropdown';

interface Props {
  label: string;
  date: Date;
  setDate: (date: Date) => void;
  style?: any;
}

const YearPicker = ({ label, date, setDate, style }: Props) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const selectedYear = String(date.getFullYear());

  const handleChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    const newDate = new Date(date);
    newDate.setFullYear(year);
    setDate(newDate);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.formGroup}>
        <MyDropdown
          value={selectedYear}
          onChange={handleChange}
          items={years.map((year) => ({
            label: `${year}`,
            value: String(year),
          }))}
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

export default YearPicker;
