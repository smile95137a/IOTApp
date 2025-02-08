import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { topUp } from '@/api/paymentApi';
import NumberFormatter from '@/component/NumberFormatter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchAllStores } from '@/api/storeApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { addAmount } from '@/store/userSlice';

const RechargeScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedOption, setSelectedOption] = useState(null);

  const rechargeOptions = [
    { id: 1, amount: '3000', bonus: '800' },
    { id: 2, amount: '2000', bonus: '600' },
    { id: 3, amount: '1000', bonus: '500' },
    { id: 4, amount: '800', bonus: '300' },
    { id: 5, amount: '500', bonus: '100' },
    { id: 6, amount: '300', bonus: '50' },
  ];

  const handleSelect = (id) => {
    setSelectedOption(id);
  };

  const handleRecharge = async () => {
    if (selectedOption !== null) {
      const selected = rechargeOptions.find(
        (option) => option.id === selectedOption
      );

      if (!selected) {
        Alert.alert('錯誤', '無法找到對應的儲值選項');
        return;
      }

      const total = ~~selected.amount + ~~selected.bonus;
      try {
        dispatch(showLoading());
        const { success, data, message } = await topUp({
          price: total,
          payType: 1,
        });
        dispatch(hideLoading());
        if (success) {
          dispatch(addAmount(total));
          navigation.navigate('RechargeSuccess', { selectedOption: selected });
        } else {
          Alert.alert('錯誤', message || '無法載入店家資訊');
        }
      } catch (error) {
        dispatch(hideLoading());
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Alert.alert('錯誤', errorMessage);
      }
    } else {
      Alert.alert('錯誤', '請選擇儲值金額');
    }
  };

  return (
    <View style={styles.container}>
      {/* Recharge Options */}
      <FlatList
        windowSize={1}
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
              儲值
              <NumberFormatter number={~~item.amount} />元
            </Text>
            <Text
              style={[
                styles.bonusText,
                selectedOption === item.id && styles.selectedText,
              ]}
            >
              送
              <NumberFormatter number={~~item.bonus} />元
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
      <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
        <Text style={styles.rechargeButtonText}>儲值</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {},
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
