import Header from '@/component/Header';
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
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchReportData } from '@/api/admin/reportApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { Picker } from '@react-native-picker/picker';
import DatePickerComponent from '@/component/DatePickerComponent';
import NumberFormatter from '@/component/NumberFormatter';
import NoData from '@/component/NoData';
import HeaderBar from '@/component/admin/HeaderBar';
import { useDialog } from '@/context/DialogContext';
import { fetchAllVendors } from '@/api/admin/vendorApi';
import { fetchStoresByVendorId } from '@/api/admin/storeApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DynamicDatePicker from '@/component/admin/DynamicDatePicker';

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

  const reportTypeOptions = [
    { label: '儲值金額', value: 'DepositAmount' },
    { label: '儲值筆數', value: 'DepositCount' },
    { label: '消費金額', value: 'ConsumptionAmount' },
    { label: '消費筆數', value: 'ConsumptionCount' },
    { label: '單店營業額', value: 'StoreRevenue' },
    { label: '廠商營業額', value: 'VendorRevenue' },
    { label: '剩餘儲值金金額', value: 'RemainingBalance' },
    { label: '會員數量', value: 'UserCount' },
  ];

  const handleSearch = async () => {
    try {
      dispatch(showLoading());
      const allResults = [];

      for (const type of selectedReportTypes) {
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
    } catch (error) {
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: '發生錯誤，請稍後再試',
        confirmText: '我知道了',
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
      } catch (error) {
        dispatch(hideLoading());
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
      } catch (error) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: '載入店家失敗',
          confirmText: '我知道了',
        });
      }
    };

    loadStores();
  }, [vendorId]);

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
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.container}
            >
              <ScrollView>
                <View style={styles.filterContainer}>
                  <View style={styles.row}>
                    <View style={styles.flexOne}>
                      <Text style={styles.label}>廠商</Text>
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

                  <View style={styles.row}>
                    <DynamicDatePicker
                      periodType={periodType}
                      startDate={startDate}
                      endDate={endDate}
                      setStartDate={setStartDate}
                      setEndDate={setEndDate}
                      style={styles.flexOne}
                    />
                  </View>

                  <Pressable style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>查詢</Text>
                  </Pressable>
                </View>

                <>
                  {reportData.length === 0 ? (
                    <NoData text="查無資料！您可嘗試其他搜尋條件！" />
                  ) : (
                    reportData.map((group, i) => {
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
                            <>
                              {group.data.length === 0 ? (
                                <NoData text="查無資料！您可嘗試其他搜尋條件！" />
                              ) : (
                                <>
                                  <View style={styles.tableHeader}>
                                    <Text
                                      style={[
                                        styles.headerText,
                                        styles.flexOne,
                                      ]}
                                    >
                                      日期
                                    </Text>
                                    <Text
                                      style={[
                                        styles.headerText,
                                        styles.flexOne,
                                      ]}
                                    >
                                      金額
                                    </Text>
                                  </View>
                                  {group.data.map((item, index) => (
                                    <View key={index} style={styles.tableRow}>
                                      <Text
                                        style={[
                                          styles.cellText,
                                          styles.flexOne,
                                        ]}
                                      >
                                        {item.dateTime}
                                      </Text>
                                      <Text
                                        style={[
                                          styles.cellText,
                                          styles.flexOne,
                                        ]}
                                      >
                                        <NumberFormatter number={item.amount} />
                                      </Text>
                                    </View>
                                  ))}
                                </>
                              )}
                            </>
                          </View>
                        </View>
                      );
                    })
                  )}
                </>
              </ScrollView>
            </KeyboardAvoidingView>
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
});

export default ReportDetailScreen;
