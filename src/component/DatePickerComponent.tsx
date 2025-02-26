import Header from '@/component/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchReportData } from '@/api/admin/reportApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { Picker } from '@react-native-picker/picker';

const DatePickerComponent = ({ label, date, setDate }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(date);

  const handleConfirm = () => {
    setDate(tempDate);
    setShowPicker(false);
  };

  return (
    <View style={styles.dateContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.dateDisplay} onPress={() => setShowPicker(true)}>
        <Text style={styles.dateText}>
          {date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </Pressable>

      {showPicker && (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                locale="zh-CN"
                themeVariant="light"
                onChange={(event, selectedDate) => {
                  if (selectedDate) setTempDate(selectedDate);
                }}
              />
              <Pressable style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>確定</Text>
              </Pressable>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowPicker(false)}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F6F9' },
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  filterContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginVertical: 15,
  },
  label: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 5 },
  dateContainer: { marginTop: 15 },
  dateDisplay: {
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
  },
  dateText: { fontSize: 16, color: '#333' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  confirmButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  cancelButton: {
    marginTop: 10,
    backgroundColor: '#CCC',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonText: { color: '#333', fontSize: 16, fontWeight: 'bold' },
  searchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  tableContainer: { backgroundColor: '#FFF', borderRadius: 10, padding: 10 },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerText: { fontSize: 16, fontWeight: 'bold' },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  cellText: { fontSize: 14 },
});
export default DatePickerComponent;
