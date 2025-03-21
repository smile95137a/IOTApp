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
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchReportData } from '@/api/admin/reportApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { Picker } from '@react-native-picker/picker';
import DatePickerComponent from '@/component/DatePickerComponent';
import NumberFormatter from '@/component/NumberFormatter';
import NoData from '@/component/NoData';
import HeaderBar from '@/component/admin/HeaderBar';

const ReportDetailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();

  const [reportData, setReportData] = useState([]);
  const [storeId, setStoreId] = useState(route.params?.storeId || '');
  const [vendorId, setVendorId] = useState(route.params?.vendorId || '');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportType, setReportType] = useState('ConsumptionAmount');
  const [periodType, setPeriodType] = useState('DAY');

  const handleSearch = async () => {
    try {
      dispatch(showLoading());
      const { success, data } = await fetchReportData({
        reportType,
        startDate,
        endDate,
        storeId,
        vendorId,
        periodType,
      });
      dispatch(hideLoading());
      if (success) {
        setReportData(data);
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar title="報表管理" />
          </View>
          <View style={styles.contentWrapper}>
            <SafeAreaView style={styles.safeArea}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
              >
                <ScrollView>
                  <View style={styles.filterContainer}>
                    <View style={styles.row}>
                      <View style={styles.flexOne}>
                        <Text style={styles.label}>報告類型</Text>
                        <Picker
                          selectedValue={reportType}
                          onValueChange={setReportType}
                        >
                          <Picker.Item label="儲值金額" value="DepositAmount" />
                          <Picker.Item
                            label="消費金額"
                            value="ConsumptionAmount"
                          />
                          <Picker.Item
                            label="單店營業額"
                            value="StoreRevenue"
                          />
                          <Picker.Item
                            label="廠商營業額"
                            value="VendorRevenue"
                          />
                          <Picker.Item
                            label="剩餘儲值金金額"
                            value="RemainingBalance"
                          />
                        </Picker>
                      </View>
                      <View style={styles.flexOne}>
                        <Text style={styles.label}>期間類型</Text>
                        <Picker
                          selectedValue={periodType}
                          onValueChange={setPeriodType}
                        >
                          <Picker.Item label="日報" value="DAY" />
                          <Picker.Item label="週報" value="WEEK" />
                          <Picker.Item label="月報" value="MONTH" />
                          <Picker.Item label="年報" value="YEARS" />
                        </Picker>
                      </View>
                    </View>

                    <View style={styles.row}>
                      <DatePickerComponent
                        label="開始日期"
                        date={startDate}
                        setDate={setStartDate}
                        style={styles.flexOne}
                      />
                      <DatePickerComponent
                        label="結束日期"
                        date={endDate}
                        setDate={setEndDate}
                        style={styles.flexOne}
                      />
                    </View>

                    <Pressable
                      style={styles.searchButton}
                      onPress={handleSearch}
                    >
                      <Text style={styles.searchButtonText}>查詢</Text>
                    </Pressable>
                  </View>
                  <View style={styles.tableContainer}>
                    {reportData.length === 0 ? (
                      <NoData text="查無資料！您可嘗試其他搜尋條件！" />
                    ) : (
                      <>
                        <View style={styles.tableHeader}>
                          <Text style={[styles.headerText, styles.flexOne]}>
                            日期
                          </Text>
                          <Text style={[styles.headerText, styles.flexOne]}>
                            金額
                          </Text>
                        </View>
                        {reportData.map((item, index) => (
                          <View key={index} style={styles.tableRow}>
                            <Text style={[styles.cellText, styles.flexOne]}>
                              {item.dateTime}
                            </Text>
                            <Text style={[styles.cellText, styles.flexOne]}>
                              <NumberFormatter number={item.amount} />
                            </Text>
                          </View>
                        ))}
                      </>
                    )}
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },

  headerWrapper: { backgroundColor: '#FFFFFF' },
  contentWrapper: { flex: 1, padding: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  flexOne: { flex: 1, marginHorizontal: 5 },
  filterContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  searchButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  searchButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  tableContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableRow: { flexDirection: 'row', paddingVertical: 6 },
  cellText: { fontSize: 14, color: '#333', textAlign: 'center' },
});

export default ReportDetailScreen;
