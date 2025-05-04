import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

type TimeSlotStatus = 'selected' | 'available' | 'booked';

interface TimeSlot {
  start: string;
  end: string;
  rate: number;
  status: TimeSlotStatus;
  onSelect?: () => void;
  onCancel?: () => void;
  onPress?: () => void;
}

const TimeSlotSelector: React.FC<TimeSlot> = ({
  start,
  end,
  rate,
  status,
  onSelect,
  onCancel,
  onPress,
}) => {
  const renderContent = () => {
    switch (status) {
      case 'selected':
        return (
          <View style={[styles.slotContainer, styles.selected]}>
            <Feather name="check" size={20} color="white" />
            <Text style={styles.selectedText}>{`${start}~${end}`}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={onSelect} style={styles.actionButton}>
                <Text style={styles.buttonText}>預約</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onCancel} style={styles.actionButton}>
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'booked':
        return (
          <View style={[styles.slotContainer, styles.booked]}>
            <Text style={styles.bookedText}>{`${start}~${end}`}</Text>
            <View style={styles.bookedButton}>
              <Text style={styles.buttonText}>已預約</Text>
            </View>
          </View>
        );
      case 'available':
      default:
        return (
          <View style={[styles.slotContainer, styles.available]}>
            <Text style={styles.availableText}>{`${start}~${end}`}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{rate}元/小時</Text>
            </View>
            <Feather name="check" size={20} color="#ccc" />
          </View>
        );
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selected: {
    backgroundColor: '#FF924F',
  },
  booked: {
    backgroundColor: '#8B9594',
  },
  available: {
    backgroundColor: '#EDEDED',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  bookedText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  availableText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  priceText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  bookedButton: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TimeSlotSelector;
