import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { createVendor } from '@/api/admin/vendorApi'; // API 請求函數

const AddVendorScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const handleSubmit = async () => {
    if (!name.trim() || !contactInfo.trim()) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }

    try {
      dispatch(showLoading());
      const { success, message } = await createVendor({ name, contactInfo });
      dispatch(hideLoading());

      if (success) {
        Alert.alert('成功', '廠商新增成功', [
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
    <View style={styles.container}>
      <Text style={styles.header}>新增廠商</Text>

      <TextInput
        style={styles.input}
        placeholder="廠商名稱"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="聯絡資訊"
        value={contactInfo}
        onChangeText={setContactInfo}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>提交</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
