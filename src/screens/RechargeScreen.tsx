import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const RechargeScreen = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const rechargeOptions = [
    { id: 1, amount: '3,000元', bonus: '800元' },
    { id: 2, amount: '2,000元', bonus: '600元' },
    { id: 3, amount: '1,000元', bonus: '500元' },
    { id: 4, amount: '800元', bonus: '300元' },
    { id: 5, amount: '500元', bonus: '100元' },
    { id: 6, amount: '300元', bonus: '50元' },
  ];

  const handleSelect = (id) => {
    setSelectedOption(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Recharge Options */}
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={rechargeOptions}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.optionBox,
              selectedOption === item.id && styles.selectedOption,
            ]}
            onPress={() => handleSelect(item.id)}
          >
            <Text
              style={[
                styles.amountText,
                selectedOption === item.id && styles.selectedText,
              ]}
            >
              儲值{item.amount}
            </Text>
            <Text
              style={[
                styles.bonusText,
                selectedOption === item.id && styles.selectedText,
              ]}
            >
              送{item.bonus}
            </Text>
            {selectedOption === item.id && (
              <MaterialIcons
                name="check"
                size={24}
                color="#FFFFFF"
                style={styles.checkmark}
              />
            )}
          </TouchableOpacity>
        )}
      />

      {/* Recharge Button */}
      <TouchableOpacity style={styles.rechargeButton}>
        <Text style={styles.rechargeButtonText}>儲值</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  optionBox: {
    width: '48%',
    minHeight: 108,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F67943',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '1%',
  },
  selectedOption: {
    backgroundColor: '#F67943',
    borderColor: '#F67943',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F67943',
  },
  bonusText: {
    fontSize: 14,
    color: '#F67943',
    marginTop: 8,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  rechargeButton: {
    backgroundColor: '#F67943',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    minWidth: 168,
  },
  rechargeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RechargeScreen;
