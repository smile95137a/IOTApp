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
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fetchUsersByRole } from '../../api/admin/roleApi';
import { updateVendor, createVendor } from '../../api/admin/vendorApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { MyDropdown } from '../../component/MyDropdown';

const AddVendorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const vendor = route.params?.vendor || null;

  const [name, setName] = useState(vendor?.name || '');
  const [contactInfo, setContactInfo] = useState(vendor?.contactInfo || '');
  const [userId, setUserId] = useState(`${vendor?.userId}` || '');
  const [companyAddress, setCompanyAddress] = useState(
    vendor?.companyAddress || ''
  );
  const [phoneNumber, setPhoneNumber] = useState(vendor?.phoneNumber || '');
  const [email, setEmail] = useState(vendor?.email || '');
  const [telephoneNumber, setTelephoneNumber] = useState(
    vendor?.telephoneNumber || ''
  );
  const [address, setAddress] = useState(vendor?.address || '');
  const [companyName, setCompanyName] = useState(vendor?.companyName || '');

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchUsersByRole(2);
        dispatch(hideLoading());

        if (response.success) {
          const fetchedUsers = response.data;

          // 篩選 isUsed 為 false 的使用者
          let filteredUsers = fetchedUsers.filter(
            (user) => user.isUsed === false
          );

          // 如果是編輯狀態，補上目前已選擇的使用者（即使 isUsed 為 true）
          if (vendor?.userId) {
            const currentUser = fetchedUsers.find(
              (user) => String(user.id) === String(vendor.userId)
            );

            const alreadyIncluded = filteredUsers.some(
              (user) => String(user.id) === String(vendor.userId)
            );

            if (currentUser && !alreadyIncluded) {
              filteredUsers.push(currentUser);
            }
          }

          setUsers(filteredUsers);
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: '無法獲取使用者列表',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !contactInfo.trim() || !userId) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫完整資訊',
        confirmText: '我知道了',
      });
      return;
    }

    const vendorData = {
      name,
      contactInfo,
      userId,
      companyAddress,
      phoneNumber,
      email,
      telephoneNumber,
      address,
      companyName,
    };

    try {
      dispatch(showLoading());
      const response = vendor?.id
        ? await updateVendor(vendor.uid, vendorData)
        : await createVendor(vendorData);
      dispatch(hideLoading());

      if (response.success) {
        await openInfoDialog({
          title: '成功',
          content: vendor?.id ? '加盟商更新成功' : '加盟商新增成功',
          confirmText: '確定',
        });
        (navigation as any).goBack();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '操作失敗',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('../../assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar
              showLeftButton
              title={vendor?.id ? '編輯加盟商' : '新增加盟商'}
            />
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
          >
            <ScrollView style={styles.contentWrapper}>
              <Text style={styles.header}>
                {vendor?.id ? '編輯加盟商' : '新增加盟商'}
              </Text>

              <Text style={styles.label}>指派使用者</Text>

              <View style={styles.formGroup}>
                <MyDropdown
                  value={userId}
                  onChange={(value) => {
                    if (value) setUserId(value);
                  }}
                  items={users.map((user) => ({
                    label: user.name,
                    value: String(user.id),
                    key: user.id,
                  }))}
                  zIndex={3000}
                />
              </View>

              <Text style={styles.label}>名稱</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="請輸入名稱"
              />

              <Text style={styles.label}>聯絡人資訊</Text>
              <TextInput
                style={styles.input}
                value={contactInfo}
                onChangeText={setContactInfo}
                placeholder="請輸入聯絡人資訊"
              />

              <Text style={styles.label}>公司名稱</Text>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="請輸入公司名稱"
              />

              <Text style={styles.label}>公司地址</Text>
              <TextInput
                style={styles.input}
                value={companyAddress}
                onChangeText={setCompanyAddress}
                placeholder="請輸入公司地址"
              />

              <Text style={styles.label}>住宅地址</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="請輸入住宅地址"
              />

              <Text style={styles.label}>行動電話</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="請輸入行動電話"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>電子郵件</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="請輸入電子郵件"
                keyboardType="email-address"
              />

              <Text style={styles.label}>室內電話</Text>
              <TextInput
                style={styles.input}
                value={telephoneNumber}
                onChangeText={setTelephoneNumber}
                placeholder="請輸入室內電話"
                keyboardType="phone-pad"
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {vendor?.id ? '更新' : '提交'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flexGrow: 1 },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  headerWrapper: { backgroundColor: '#FFFFFF' },
  contentWrapper: { flex: 1, padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 50,
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
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
  formGroup: {},
});

export default AddVendorScreen;
