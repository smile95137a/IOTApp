import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import {
  createRechargeStandard,
  updateRechargeStandard,
} from '../../api/admin/rechargeStandardApi';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { hideLoading } from '../../store/loadingSlice';
import { getErrorMessage } from '../../utils/errorUtils';

const AddRechargeStandard = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();
  const standard = route.params?.standard;
  const isEdit = !!standard?.id;

  const [rechargeAmount, setRechargeAmount] = useState(
    standard?.rechargeAmount?.toString() || ''
  );
  const [bonusAmount, setBonusAmount] = useState(
    standard?.bonusAmount?.toString() || ''
  );
  const [status, setStatus] = useState(standard?.status || 'AVAILABLE');

  const handleSubmit = async () => {
    if (!rechargeAmount.trim() || !bonusAmount.trim() || !status.trim()) {
      await openInfoDialog({ title: '錯誤', content: '請填寫完整欄位' });
      return;
    }

    const payload = {
      rechargeAmount: Number(rechargeAmount),
      bonusAmount: Number(bonusAmount),
      status,
    };

    try {
      const response = isEdit
        ? await updateRechargeStandard(standard.id, payload)
        : await createRechargeStandard(payload);

      if (response.success) {
        await openInfoDialog({ title: '成功', content: '已儲存儲值標準' });
        navigation.goBack();
      } else {
        await openInfoDialog({ title: '錯誤', content: response.message });
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundImageWrapper}>
        <Image
          source={require('../../assets/iot-admin-bg.png')}
          style={{ width: '100%' }}
          resizeMode="contain"
        />
      </View>
      <HeaderBar
        title={isEdit ? '編輯儲值標準' : '新增儲值標準'}
        showLeftButton
      />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <View style={styles.twoColumnRow}>
          <View style={styles.twoColumnItem}>
            <Text style={styles.inputLabel}>儲值金額</Text>
            <TextInput
              value={rechargeAmount}
              onChangeText={setRechargeAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholder="請輸入金額"
            />
          </View>
          <View style={styles.twoColumnItem}>
            <Text style={styles.inputLabel}>贈送金額</Text>
            <TextInput
              value={bonusAmount}
              onChangeText={setBonusAmount}
              keyboardType="numeric"
              style={styles.input}
              placeholder="請輸入金額"
            />
          </View>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.twoColumnItem}>
            <Text style={styles.inputLabel}>狀態</Text>
            <RNPickerSelect
              value={status}
              onValueChange={(value) => setStatus(value)}
              items={[
                { label: '啟用', value: 'AVAILABLE' },
                { label: '停用', value: 'UNAVAILABLE' },
              ]}
              placeholder={{ label: '請選擇狀態', value: '' }}
              useNativeAndroidPickerStyle={false}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                iconContainer: styles.iconContainer,
              }}
              Icon={() => (
                <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
              )}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>送出</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  contentWrapper: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  twoColumnItem: { flex: 1 },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
});

export default AddRechargeStandard;
