import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { fetchReportData } from '../../api/admin/reportApi';
import { fetchStoresByVendorId } from '../../api/admin/storeApi';
import { fetchAllVendors } from '../../api/admin/vendorApi';
import DynamicDatePicker from '../../component/admin/DynamicDatePicker';
import HeaderBar from '../../component/admin/HeaderBar';
import NoData from '../../component/NoData';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { logJson } from '../../utils/logJsonUtils';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

const ReportDetailScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { openInfoDialog } = useDialog();

  const [vendors, setVendors] = useState([]);
  const [stores, setStores] = useState([]);

  const [reportData, setReportData] = useState<{ type: string; data: any[] }[]>(
    []
  );
  const [storeId, setStoreId] = useState(route.params?.storeId || '');
  const [vendorId, setVendorId] = useState(route.params?.vendorId || '');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedReportTypes, setSelectedReportTypes] = useState<string[]>([
    'ConsumptionAmount',
  ]);
  const [periodType, setPeriodType] = useState('DAY');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const currentYear = new Date().getFullYear();
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      label: `${currentYear}-${String(month).padStart(2, '0')}`,
      value: `${currentYear}-${String(month).padStart(2, '0')}`,
    };
  });
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentYear - i;
    return { label: `${year}`, value: `${year}` };
  });

  const reportTypeOptions = [
    { label: '儲值金額', value: 'DepositAmount' },
    { label: '儲值筆數', value: 'DepositCount' },
    { label: '消費金額', value: 'ConsumptionAmount' },
    { label: '消費筆數', value: 'ConsumptionCount' },
    { label: '單店營業額', value: 'StoreRevenue' },
    { label: '加盟商營業額', value: 'VendorRevenue' },
    { label: '剩餘儲值金金額', value: 'RemainingBalance' },
    { label: '會員數量', value: 'UserCount' },
  ];

  const handleSearch = async () => {
    if (periodType === 'DAY' && endDate < startDate) {
      await openInfoDialog({
        title: '錯誤',
        content: '日報查詢時，結束日期不能早於開始日期',
        confirmText: '我知道了',
      });
      return;
    }
    try {
      dispatch(showLoading());
      const allResults = [];

      for (const type of selectedReportTypes) {
        logJson('fetchReportData', {
          reportType: type,
          startDate,
          endDate,
          storeId,
          vendorId,
          periodType,
        });
        const { success, data } = await fetchReportData({
          reportType: type,
          startDate,
          endDate,
          storeId,
          vendorId,
          periodType,
        });
        if (success) {
          allResults.push({ type, data });
        }
      }

      setReportData(allResults);
      dispatch(hideLoading());
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    const loadVendorsAndStores = async () => {
      try {
        dispatch(showLoading());
        const vendorRes = await fetchAllVendors();
        dispatch(hideLoading());

        if (vendorRes.success) setVendors(vendorRes.data);
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadVendorsAndStores();
  }, []);

  useEffect(() => {
    const loadStores = async () => {
      if (!vendorId) {
        setStores([]);
        setStoreId('');
        return;
      }
      try {
        dispatch(showLoading());
        const { success, data } = await fetchStoresByVendorId(vendorId);
        dispatch(hideLoading());
        if (success) {
          setStores(data);
          setStoreId('');
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

    loadStores();
  }, [vendorId]);
  const tableSchemaMap: Record<string, { key: string; label: string }[]> = {
    DepositAmount: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '金額' },
    ],
    DepositCount: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '金額' },
    ],
    ConsumptionAmount: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '金額' },
    ],
    ConsumptionCount: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '筆數' },
    ],
    StoreRevenue: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '金額' },
    ],
    VendorRevenue: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '金額' },
    ],
    UserCount: [
      { key: 'dateTime', label: '日期' },
      { key: 'amount', label: '數量' },
    ],
    RemainingBalance: [
      { key: 'userId', label: '編號' },
      { key: 'userName', label: '姓名' },
      { key: 'remainingBalance', label: '剩餘金額' },
    ],
  };

  const renderTable = (group: { type: string; data: any[] }) => {
    const schema = tableSchemaMap[group.type];

    if (!schema || group.data.length === 0) {
      return <NoData text="查無資料！您可嘗試其他搜尋條件！" />;
    }

    return (
      <>
        <View style={styles.tableHeader}>
          {schema.map((col, i) => (
            <Text key={i} style={[styles.headerText, styles.flexOne]}>
              {col.label}
            </Text>
          ))}
        </View>

        {group.data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            {schema.map((col, i) => (
              <Text key={i} style={[styles.cellText, styles.flexOne]}>
                {typeof item[col.key] === 'number' ? (
                  <NumberFormatter number={item[col.key]} />
                ) : (
                  item[col.key]
                )}
              </Text>
            ))}
          </View>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (periodType === 'WEEK') {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate);
    }
  }, [periodType, startDate]);

  useEffect(() => {
    if (periodType === 'WEEK') {
      const newEnd = new Date(startDate);
      newEnd.setDate(newEnd.getDate() + 6);
      setEndDate(newEnd);
    } else if (periodType === 'MONTH') {
      const firstDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        1
      );
      const lastDay = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
      setStartDate(firstDay);
      setEndDate(lastDay);
    } else if (periodType === 'YEARS') {
      const firstDay = new Date(startDate.getFullYear(), 0, 1);
      const lastDay = new Date(startDate.getFullYear(), 11, 31);
      setStartDate(firstDay);
      setEndDate(lastDay);
    }
  }, [periodType]);

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
            <HeaderBar title="報表管理" showLeftButton />
          </View>
          <View style={styles.contentWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.filterContainer}>
                  <View style={styles.row}>
                    <View style={styles.flexOne}>
                      <Text style={styles.label}>加盟商</Text>
                      <RNPickerSelect
                        value={vendorId}
                        onValueChange={(value) => setVendorId(value)}
                        items={vendors.map((vendor) => ({
                          key: vendor.id,
                          label: vendor.name,
                          value: String(vendor.id),
                        }))}
                        style={{
                          inputIOS: styles.dropdownInput,
                          inputAndroid: styles.dropdownInput,
                          iconContainer: styles.iconContainer,
                        }}
                        Icon={() => (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="#888"
                          />
                        )}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: '請選擇', value: '' }}
                      />
                    </View>
                    <View style={styles.flexOne}>
                      <Text style={styles.label}>店家</Text>
                      <RNPickerSelect
                        value={storeId}
                        onValueChange={(value) => setStoreId(value)}
                        items={stores.map((store) => ({
                          key: store.id,
                          label: store.name,
                          value: String(store.id),
                        }))}
                        style={{
                          inputIOS: styles.dropdownInput,
                          inputAndroid: styles.dropdownInput,
                          iconContainer: styles.iconContainer,
                        }}
                        Icon={() => (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="#888"
                          />
                        )}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: '請選擇', value: '' }}
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.flexOne}>
                      <Text style={styles.label}>報告類型（可複選）</Text>
                      {reportTypeOptions.map((option) => (
                        <Pressable
                          key={option.value}
                          style={styles.checkboxRow}
                          onPress={() => {
                            setSelectedReportTypes((prev) =>
                              prev.includes(option.value)
                                ? prev.filter((v) => v !== option.value)
                                : [...prev, option.value]
                            );
                          }}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              selectedReportTypes.includes(option.value) &&
                                styles.checkboxSelected,
                            ]}
                          />
                          <Text>{option.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                    <View style={styles.flexOne}>
                      <Text style={styles.label}>期間類型</Text>
                      <RNPickerSelect
                        value={periodType}
                        onValueChange={(value) => setPeriodType(value)}
                        items={[
                          { label: '日報', value: 'DAY' },
                          { label: '週報', value: 'WEEK' },
                          { label: '月報', value: 'MONTH' },
                          { label: '年報', value: 'YEARS' },
                        ]}
                        style={{
                          inputIOS: styles.dropdownInput,
                          inputAndroid: styles.dropdownInput,
                          iconContainer: styles.iconContainer,
                        }}
                        Icon={() => (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="#888"
                          />
                        )}
                        useNativeAndroidPickerStyle={false}
                        placeholder={{ label: '請選擇', value: '' }}
                      />
                    </View>
                  </View>

                  {periodType === 'DAY' || periodType === 'WEEK' ? (
                    <View style={styles.row}>
                      <View style={styles.flexOne}>
                        <Text style={styles.label}>開始日期</Text>
                        <TouchableOpacity
                          style={styles.dateInputWrapper}
                          onPress={() => setShowStartPicker(true)}
                        >
                          <Text
                            style={
                              startDate
                                ? styles.dateText
                                : styles.datePlaceholder
                            }
                          >
                            {moment(startDate).format('YYYY-MM-DD')}
                          </Text>
                          <MaterialIcons
                            name="calendar-today"
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>

                      <View style={styles.flexOne}>
                        <Text style={styles.label}>結束日期</Text>
                        <TouchableOpacity
                          style={[
                            styles.dateInputWrapper,
                            periodType === 'WEEK' && {
                              backgroundColor: '#f0f0f0',
                            },
                          ]}
                          disabled={periodType === 'WEEK'}
                          onPress={() => setShowEndPicker(true)}
                        >
                          <Text
                            style={
                              endDate ? styles.dateText : styles.datePlaceholder
                            }
                          >
                            {moment(endDate).format('YYYY-MM-DD')}
                          </Text>
                          <MaterialIcons
                            name="calendar-today"
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : periodType === 'MONTH' ? (
                    <View>
                      <Text style={styles.label}>選擇月份</Text>
                      <RNPickerSelect
                        value={moment(startDate).format('YYYY-MM')}
                        onValueChange={(value) => {
                          const [year, month] = value.split('-');
                          const date = new Date(
                            Number(year),
                            Number(month) - 1,
                            1
                          );
                          setStartDate(date);
                          setEndDate(
                            new Date(date.getFullYear(), date.getMonth() + 1, 0)
                          ); // 當月最後一天
                        }}
                        items={monthOptions}
                        style={{
                          inputIOS: styles.dropdownInput,
                          inputAndroid: styles.dropdownInput,
                          iconContainer: styles.iconContainer,
                        }}
                        Icon={() => (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="#888"
                          />
                        )}
                        placeholder={{ label: '請選擇月份', value: '' }}
                      />
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.label}>選擇年份</Text>
                      <RNPickerSelect
                        value={moment(startDate).format('YYYY')}
                        onValueChange={(value) => {
                          const date = new Date(Number(value), 0, 1);
                          setStartDate(date);
                          setEndDate(new Date(Number(value), 11, 31));
                        }}
                        items={yearOptions}
                        style={{
                          inputIOS: styles.dropdownInput,
                          inputAndroid: styles.dropdownInput,
                          iconContainer: styles.iconContainer,
                        }}
                        Icon={() => (
                          <MaterialIcons
                            name="arrow-drop-down"
                            size={24}
                            color="#888"
                          />
                        )}
                        placeholder={{ label: '請選擇年份', value: '' }}
                      />
                    </View>
                  )}

                  <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>查詢</Text>
                  </Pressable>
                </View>

                <>
                  {reportData.map((group, i) => {
                    const typeLabel =
                      reportTypeOptions.find((r) => r.value === group.type)
                        ?.label || group.type;

                    return (
                      <View style={styles.tableContainer} key={i}>
                        <View style={{ width: '100%', marginVertical: 20 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              marginBottom: 6,
                            }}
                          >
                            {typeLabel}
                          </Text>
                          {renderTable(group)}
                        </View>
                      </View>
                    );
                  })}
                </>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </View>
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
                  const selectedDate = new Date(day.dateString);
                  setStartDate(selectedDate);

                  if (periodType === 'WEEK') {
                    const newEndDate = new Date(selectedDate);
                    newEndDate.setDate(newEndDate.getDate() + 6);
                    setEndDate(newEndDate);
                  }

                  setShowStartPicker(false);
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
                  setEndDate(new Date(day.dateString));
                  setShowEndPicker(false);
                }}
                markedDates={{
                  [moment(endDate).format('YYYY-MM-DD')]: {
                    selected: true,
                    selectedColor: '#FFC702',
                  },
                }}
              />
            </View>
          </View>
        </Modal>
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#999',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
  },
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
  dropdownInput: {
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 100,
    alignItems: 'center',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
  remainingCardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  remainingCard: {
    width: '48%',
    backgroundColor: '#FFFBEA',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  remainingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C43D00',
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
});

export default ReportDetailScreen;
