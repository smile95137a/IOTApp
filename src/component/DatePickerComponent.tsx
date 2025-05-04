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

const DatePickerComponent = ({ label, date, setDate, style }: Props) => {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${day}`;
    dates.push({ label: formatted, value: formatted });
  }

  const selectedValue = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const handleChange = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    const newDate = new Date(year, month - 1, day);
    setDate(newDate);
  };

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        value={selectedValue}
        onValueChange={handleChange}
        items={dates}
        style={{
          inputIOS: styles.input,
          inputAndroid: styles.input,
          iconContainer: styles.iconContainer,
        }}
        Icon={() => (
          <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
        )}
        useNativeAndroidPickerStyle={false}
        placeholder={{ label: '選擇日期', value: '' }}
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

export default DatePickerComponent;
