import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createStore, updateStore } from '@/api/admin/storeApi';
import { fetchAllVendors } from '@/api/admin/vendorApi';
import { Picker } from '@react-native-picker/picker';

const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const AddStoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();

  const store = route.params?.store || null;
  const isEditMode = !!store;

  console.log('@@@@@@@', store);

  const [name, setName] = useState(store?.name || '');
  const [address, setAddress] = useState(store?.address || '');
  const [vendorId, setVendorId] = useState(
    store?.vendor?.id ? String(store.vendor.id) : ''
  );
  const [lat, setLat] = useState(store?.lat ? String(store.lat) : '');
  const [lon, setLon] = useState(store?.lon ? String(store.lon) : '');
  const [deposit, setDeposit] = useState(
    store?.deposit ? String(store.deposit) : ''
  );
  const [discountRate, setDiscountRate] = useState(
    store?.discountRate ? String(store.discountRate) : ''
  );
  const [regularRate, setRegularRate] = useState(
    store?.regularRate ? String(store.regularRate) : ''
  );
  const [vendors, setVendors] = useState([]);

  // 初始化價格排程（確保所有天都有完整數據）
  const [pricingSchedules, setPricingSchedules] = useState(
    weekDays.map((day) => {
      const existingSchedule = store?.pricingSchedules?.find(
        (schedule) => schedule.dayOfWeek === day
      );
      return {
        dayOfWeek: day,
        regularStartTime: existingSchedule?.regularStartTime || '10:00',
        regularEndTime: existingSchedule?.regularEndTime || '18:00',
        regularRate: existingSchedule?.regularRate
          ? String(existingSchedule.regularRate)
          : '100',
        discountStartTime: existingSchedule?.discountStartTime || '18:00',
        discountEndTime: existingSchedule?.discountEndTime || '23:00',
        discountRate: existingSchedule?.discountRate
          ? String(existingSchedule.discountRate)
          : '80',
      };
    })
  );

  useEffect(() => {
    const loadVendors = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllVendors();
        dispatch(hideLoading());

        if (response.success) {
          setVendors(response.data);
        } else {
          Alert.alert('錯誤', '無法獲取供應商列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        Alert.alert('錯誤', '獲取供應商失敗');
      }
    };

    loadVendors();
  }, []);

  // 更新價格排程
  const updateSchedule = (dayIndex, key, value) => {
    const updatedSchedules = [...pricingSchedules];
    updatedSchedules[dayIndex][key] = value;
    setPricingSchedules(updatedSchedules);
  };

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
      vendor: { id: parseInt(vendorId) },
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      deposit: parseFloat(deposit) || 0,
      discountRate: parseFloat(discountRate) || 0,
      regularRate: parseFloat(regularRate) || 0,
      pricingSchedules: pricingSchedules.map((schedule) => ({
        ...schedule,
        regularRate: parseFloat(schedule.regularRate) || 0,
        discountRate: parseFloat(schedule.discountRate) || 0,
      })),
    };

    try {
      dispatch(showLoading());

      let response;
      console.log('@@@@@@@@@@@@@@@', storeData);

      if (isEditMode) {
        response = await updateStore(store.uid, storeData);
      } else {
        response = await createStore(storeData);
      }

      dispatch(hideLoading());

      if (response.success) {
        Alert.alert('成功', isEditMode ? '店家資訊更新成功' : '店家新增成功', [
          { text: '確定', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('錯誤', response.message || '操作失敗');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{isEditMode ? '編輯店家' : '新增店家'}</Text>

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

      <Picker
        selectedValue={vendorId}
        onValueChange={setVendorId}
        style={styles.picker}
      >
        <Picker.Item label="請選擇供應商" value="" />
        {vendors.map((vendor) => (
          <Picker.Item
            key={vendor.id}
            label={vendor.name}
            value={String(vendor.id)}
          />
        ))}
      </Picker>
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
      {pricingSchedules.map((schedule, index) => (
        <View key={schedule.dayOfWeek} style={styles.scheduleContainer}>
          <Text style={styles.dayLabel}>
            {schedule.dayOfWeek.toUpperCase()}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="一般開始時間"
            value={schedule.regularStartTime}
            onChangeText={(value) =>
              updateSchedule(index, 'regularStartTime', value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="一般結束時間"
            value={schedule.regularEndTime}
            onChangeText={(value) =>
              updateSchedule(index, 'regularEndTime', value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="一般價格"
            keyboardType="numeric"
            value={schedule.regularRate}
            onChangeText={(value) =>
              updateSchedule(index, 'regularRate', value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="折扣開始時間"
            value={schedule.discountStartTime}
            onChangeText={(value) =>
              updateSchedule(index, 'discountStartTime', value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="折扣結束時間"
            value={schedule.discountEndTime}
            onChangeText={(value) =>
              updateSchedule(index, 'discountEndTime', value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="折扣價格"
            keyboardType="numeric"
            value={schedule.discountRate}
            onChangeText={(value) =>
              updateSchedule(index, 'discountRate', value)
            }
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {isEditMode ? '更新' : '提交'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },

  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },

  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#222',
  },

  scheduleContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fdfdfd',
  },

  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },

  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddStoreScreen;
