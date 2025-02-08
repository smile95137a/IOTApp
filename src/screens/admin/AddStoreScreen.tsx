import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createStore } from '@/api/admin/storeApi';

const AddStoreScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  // 狀態管理：表單欄位
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [deposit, setDeposit] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [regularRate, setRegularRate] = useState('');
  const [regularDateStart, setRegularDateStart] = useState('');
  const [regularDateEnd, setRegularDateEnd] = useState('');
  const [discountDateStart, setDiscountDateStart] = useState('');
  const [discountDateEnd, setDiscountDateEnd] = useState('');
  const [regularTimeStart, setRegularTimeStart] = useState('');
  const [regularTimeEnd, setRegularTimeEnd] = useState('');
  const [discountTimeStart, setDiscountTimeStart] = useState('');
  const [discountTimeEnd, setDiscountTimeEnd] = useState('');

  // 提交店家資訊
  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !vendorId.trim() ||
      !lat.trim() ||
      !lon.trim()
    ) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }

    const storeData = {
      name,
      address,
      vendor: {
        id: parseInt(vendorId),
      },
      poolTables: [],
      equipments: [],
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      deposit: parseFloat(deposit) || 0,
      discountRate: parseFloat(discountRate) || 0,
      regularRate: parseFloat(regularRate) || 0,
      regularDateRangeStart: regularDateStart,
      regularDateRangeEnd: regularDateEnd,
      discountDateRangeStart: discountDateStart,
      discountDateRangeEnd: discountDateEnd,
      regularTimeRangeStart: regularTimeStart,
      regularTimeRangeEnd: regularTimeEnd,
      discountTimeRangeStart: discountTimeStart,
      discountTimeRangeEnd: discountTimeEnd,
    };

    try {
      dispatch(showLoading());
      const { success, message } = await createStore(storeData);
      dispatch(hideLoading());

      if (success) {
        Alert.alert('成功', '店家新增成功', [
          { text: '確定', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('錯誤', message || '新增失敗');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>新增店家</Text>

        <TextInput
          style={styles.input}
          placeholder="店家名稱"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="地址"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="廠商 ID"
          keyboardType="numeric"
          value={vendorId}
          onChangeText={setVendorId}
        />
        <TextInput
          style={styles.input}
          placeholder="緯度 (Lat)"
          keyboardType="numeric"
          value={lat}
          onChangeText={setLat}
        />
        <TextInput
          style={styles.input}
          placeholder="經度 (Lon)"
          keyboardType="numeric"
          value={lon}
          onChangeText={setLon}
        />
        <TextInput
          style={styles.input}
          placeholder="保證金 (可選)"
          keyboardType="numeric"
          value={deposit}
          onChangeText={setDeposit}
        />
        <TextInput
          style={styles.input}
          placeholder="折扣費率 (可選)"
          keyboardType="numeric"
          value={discountRate}
          onChangeText={setDiscountRate}
        />
        <TextInput
          style={styles.input}
          placeholder="一般費率 (可選)"
          keyboardType="numeric"
          value={regularRate}
          onChangeText={setRegularRate}
        />

        <TextInput
          style={styles.input}
          placeholder="一般價格 日期範圍開始"
          value={regularDateStart}
          onChangeText={setRegularDateStart}
        />
        <TextInput
          style={styles.input}
          placeholder="一般價格 日期範圍結束"
          value={regularDateEnd}
          onChangeText={setRegularDateEnd}
        />
        <TextInput
          style={styles.input}
          placeholder="折扣價格 日期範圍開始"
          value={discountDateStart}
          onChangeText={setDiscountDateStart}
        />
        <TextInput
          style={styles.input}
          placeholder="折扣價格 日期範圍結束"
          value={discountDateEnd}
          onChangeText={setDiscountDateEnd}
        />

        <TextInput
          style={styles.input}
          placeholder="一般價格 時間範圍開始"
          value={regularTimeStart}
          onChangeText={setRegularTimeStart}
        />
        <TextInput
          style={styles.input}
          placeholder="一般價格 時間範圍結束"
          value={regularTimeEnd}
          onChangeText={setRegularTimeEnd}
        />
        <TextInput
          style={styles.input}
          placeholder="折扣價格 時間範圍開始"
          value={discountTimeStart}
          onChangeText={setDiscountTimeStart}
        />
        <TextInput
          style={styles.input}
          placeholder="折扣價格 時間範圍結束"
          value={discountTimeEnd}
          onChangeText={setDiscountTimeEnd}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>提交</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStoreScreen;
