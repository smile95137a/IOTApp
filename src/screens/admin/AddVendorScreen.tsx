import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createVendor, updateVendor } from '@/api/admin/vendorApi';
import { fetchAllStores } from '@/api/admin/storeApi'; // 取得店家列表的 API
import Checkbox from 'expo-checkbox'; // 選擇店家用的 Checkbox

const AddVendorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();

  const vendor = route.params?.vendor || null; // 檢查是否有傳入 vendor，若無則為新增模式

  const [name, setName] = useState(vendor?.name || '');
  const [contactInfo, setContactInfo] = useState(vendor?.contactInfo || '');
  const [stores, setStores] = useState([]); // API 回傳的店家列表
  const [selectedStores, setSelectedStores] = useState(
    vendor?.stores?.map((store) => store.id) || []
  ); // 預先填充已關聯的店家 ID

  // 取得 `stores` 列表
  useEffect(() => {
    const loadStores = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllStores();
        dispatch(hideLoading());

        if (response.success) {
          setStores(response.data); // 存入店家列表
        } else {
          Alert.alert('錯誤', '無法獲取店家列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        Alert.alert('錯誤', '獲取店家失敗，請稍後再試');
      }
    };

    loadStores();
  }, []);

  // 切換 `Checkbox` 狀態
  const toggleStoreSelection = (storeId) => {
    setSelectedStores((prevSelected) =>
      prevSelected.includes(storeId)
        ? prevSelected.filter((id) => id !== storeId)
        : [...prevSelected, storeId]
    );
  };

  // 提交 `Vendor` 資料
  const handleSubmit = async () => {
    if (!name.trim() || !contactInfo.trim()) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }

    const vendorData = {
      name,
      contactInfo,
    };

    try {
      dispatch(showLoading());
      console.log('提交資料:', vendorData);

      let response;
      if (vendor?.id) {
        // **編輯模式**
        response = await updateVendor(vendor.uid, vendorData);
      } else {
        // **新增模式**
        console.log(vendorData);

        response = await createVendor(vendorData);
      }

      dispatch(hideLoading());

      if (response.success) {
        Alert.alert('成功', vendor?.id ? '廠商更新成功' : '廠商新增成功', [
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          {vendor?.id ? '編輯廠商' : '新增廠商'}
        </Text>

        {/* 廠商名稱 */}
        <TextInput
          style={styles.input}
          placeholder="廠商名稱"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          maxLength={50}
        />

        {/* 聯絡資訊 */}
        <TextInput
          style={styles.input}
          placeholder="聯絡資訊 (電子郵件或電話)"
          value={contactInfo}
          onChangeText={setContactInfo}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          maxLength={100}
        />

        {/* 提交按鈕 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>
            {vendor?.id ? '更新' : '提交'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  noStoresText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
    width: 20,
    height: 20,
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

export default AddVendorScreen;
