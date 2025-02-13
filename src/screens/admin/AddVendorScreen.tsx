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
import { fetchAllStores } from '@/api/admin/storeApi';
import { fetchAllUsers } from '@/api/admin/adminUserApi';
import { Picker } from '@react-native-picker/picker';

const AddVendorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();

  const vendor = route.params?.vendor || null;

  console.log('232323232@@@', vendor);

  const [name, setName] = useState(vendor?.name || '');
  const [contactInfo, setContactInfo] = useState(vendor?.contactInfo || '');
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(`${vendor?.userId}` || '');

  useEffect(() => {
    const loadStores = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllStores();
        dispatch(hideLoading());

        if (response.success) {
          setStores(response.data);
        } else {
          Alert.alert('錯誤', '無法獲取店家列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        Alert.alert('錯誤', '獲取店家失敗，請稍後再試');
      }
    };

    const loadUsers = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllUsers();
        dispatch(hideLoading());

        if (response.success) {
          console.log('原始使用者資料:', response.data); // 確認 API 回傳的資料格式

          // 過濾 roles 陣列中包含 roleId 為 1 或 2 的使用者
          const filteredUsers = response.data.filter((user) => {
            console.log(`使用者 ${user.name} 的角色:`, user.roles); // 確認 roles 陣列內容
            return user.roles.some((role) => {
              return role.id === 1 || role.id === 2;
            });
          });

          console.log('過濾後的使用者:', filteredUsers); // 確認篩選後的結果
          setUsers(filteredUsers);
        } else {
          Alert.alert('錯誤', '無法獲取使用者列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error('獲取使用者時發生錯誤:', error);
        Alert.alert('錯誤', '獲取使用者失敗，請稍後再試');
      }
    };

    loadStores();
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !contactInfo.trim() || !selectedUser) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }

    const vendorData = {
      name,
      contactInfo,
      userId: selectedUser,
    };

    try {
      dispatch(showLoading());
      let response;

      if (vendor?.id) {
        response = await updateVendor(vendor.uid, vendorData);
      } else {
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

        <TextInput
          style={styles.input}
          placeholder="廠商名稱"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          maxLength={50}
        />

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

        <Picker
          selectedValue={selectedUser}
          onValueChange={setSelectedUser}
          style={styles.picker}
        >
          <Picker.Item label="請選擇使用者" value="" />
          {users.map((user) => (
            <Picker.Item
              key={user.id}
              label={user.name}
              value={String(user.id)}
            />
          ))}
        </Picker>

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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
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
