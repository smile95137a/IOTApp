import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface MyDropdownProps {
  label?: string;
  value: any;
  onChange: (value: any) => void;
  items: { label: string; value: any }[];
  zIndex?: number;
}

export const MyDropdown: React.FC<MyDropdownProps> = ({
  label,
  value,
  onChange,
  items,
  zIndex = 1000,
}) => {
  const [open, setOpen] = useState(false);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const computedZIndex = open ? zIndex + 1000 : zIndex;

  return (
    <View
      style={[
        styles.wrapper,
        { zIndex: computedZIndex, elevation: computedZIndex },
      ]}
    >
      {label && <Text style={styles.label}>{label}</Text>}

      <DropDownPicker
        open={open}
        value={value}
        items={localItems}
        setOpen={setOpen}
        setValue={(callback) => {
          onChange(callback(value));
          setOpen(false);
        }}
        setItems={setLocalItems}
        placeholder="請選擇..."
        style={styles.dropdown}
        textStyle={styles.text}
        dropDownContainerStyle={styles.dropdownContainer}
        listMode="SCROLLVIEW"
        dropDownDirection="BOTTOM"
        zIndex={computedZIndex}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    height: 50,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    color: '#555',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 6,
    width: '100%',
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    color: '#333',
  },
});
