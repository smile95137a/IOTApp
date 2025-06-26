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
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import {
  createRechargePromotion,
  updateRechargePromotion,
} from '../../api/admin/rechargePromotionApi';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { getErrorMessage } from '../../utils/errorUtils';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { logJson } from '../../utils/logJsonUtils';
import moment from 'moment';
import { Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
const currentYear = new Date().getFullYear();
const generateYearDateOptions = () => {
  const options = [];
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 31; day++) {
      const formatted = `${currentYear}-${String(month).padStart(
        2,
        '0'
      )}-${String(day).padStart(2, '0')}`;
      const date = new Date(formatted);
      if (
        date.getFullYear() === currentYear &&
        date.getMonth() + 1 === month &&
        date.getDate() === day
      ) {
        options.push({ label: formatted, value: formatted });
      }
    }
  }
  return options;
};

const AddRechargePromotion = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();
  const promotion = route.params?.promotion;
  const isEdit = !!promotion?.id;
  logJson('promotion', promotion);
  const [name, setName] = useState(promotion?.name || '');
  const [startDate, setStartDate] = useState(promotion?.startDate || '');
  const [endDate, setEndDate] = useState(promotion?.endDate || '');
  const [details, setDetails] = useState(
    promotion?.details || [{ rechargeAmount: '', bonusAmount: '' }]
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !startDate.trim() || !endDate.trim()) {
      await openInfoDialog({ title: '錯誤', content: '請填寫完整欄位' });
      return;
    }
    if (moment(endDate).isBefore(startDate)) {
      await openInfoDialog({
        title: '錯誤',
        content: '結束日期不能早於開始日期',
      });
      return;
    }

    try {
      dispatch(showLoading());
      const payload = { name, startDate, endDate, details };
      const res = isEdit
        ? await updateRechargePromotion(promotion.id, payload)
        : await createRechargePromotion(payload);
      dispatch(hideLoading());

      if (res.success) {
        await openInfoDialog({ title: '成功', content: '活動已儲存' });
        navigation.goBack();
      } else {
        await openInfoDialog({ title: '錯誤', content: res.message });
      }
    } catch (error) {
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
        title={isEdit ? '編輯儲值優惠' : '新增儲值優惠'}
        showLeftButton
      />
      <ScrollView contentContainerStyle={styles.contentWrapper}>
        <Text style={styles.inputLabel}>活動名稱</Text>
        <TextInput
          style={styles.input}
          placeholder="請輸入活動名稱"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.inputLabel}>開始日期</Text>
        <TouchableOpacity
          style={styles.dateInputWrapper}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={startDate ? styles.dateText : styles.datePlaceholder}>
            {startDate || '請選擇開始日期'}
          </Text>
          <Icon name="calendar-today" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>結束日期</Text>
        <TouchableOpacity
          style={styles.dateInputWrapper}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={endDate ? styles.dateText : styles.datePlaceholder}>
            {endDate || '請選擇結束日期'}
          </Text>
          <Icon name="calendar-today" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.inputLabel}>優惠條件</Text>
        {details.map((d, idx) => (
          <View key={idx} style={styles.detailRow}>
            <TextInput
              style={styles.detailInput}
              placeholder="儲值金額"
              keyboardType="numeric"
              value={d.rechargeAmount.toString()}
              onChangeText={(text) => {
                const newDetails = [...details];
                newDetails[idx].rechargeAmount = text;
                setDetails(newDetails);
              }}
            />
            <TextInput
              style={styles.detailInput}
              placeholder="贈送金額"
              keyboardType="numeric"
              value={d.bonusAmount.toString()}
              onChangeText={(text) => {
                const newDetails = [...details];
                newDetails[idx].bonusAmount = text;
                setDetails(newDetails);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                const newDetails = [...details];
                newDetails.splice(idx, 1);
                setDetails(newDetails);
              }}
            >
              <Icon name="remove-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          onPress={() =>
            setDetails([...details, { rechargeAmount: '', bonusAmount: '' }])
          }
        >
          <Text style={styles.addLink}>+ 新增條件</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>儲存</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={showStartPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStartPicker(false)}
      >
        <View style={styles.calendarModal}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                setStartDate(day.dateString);
                setShowStartPicker(false);
              }}
              markedDates={{
                [startDate]: { selected: true, selectedColor: '#FFC702' },
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEndPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEndPicker(false)}
      >
        <View style={styles.calendarModal}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={(day) => {
                setEndDate(day.dateString);
                setShowEndPicker(false);
              }}
              markedDates={{
                [endDate]: { selected: true, selectedColor: '#FFC702' },
              }}
            />
          </View>
        </View>
      </Modal>
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
  contentWrapper: { padding: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  addLink: {
    color: '#007AFF',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#FFC702',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
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
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
    marginBottom: 12,
  },
  clearDateButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  clearDateText: {
    fontSize: 13,
    color: '#007AFF',
  },
  calendarModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    elevation: 5,
  },

  dateInputWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 16,
    color: '#000',
  },

  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
});

export default AddRechargePromotion;
