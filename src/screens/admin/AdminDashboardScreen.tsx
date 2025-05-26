import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';
import { fetchStoreListByUserId } from '../../api/admin/storeApi';
import { fetchTurnover } from '../../api/admin/turnoverApi';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import SharedScreenLayout from '../../navigators/SharedScreenLayout';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch, RootState } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';

const AdminDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [todayTotalAmount, setTodayTotalAmount] = useState(0);
  const [todayTransactionCount, setTodayTransactionCount] = useState(0);
  const [todayTopupAmount, setTodayTopupAmount] = useState(0);
  const [todayTopupCount, setTodayTopupCount] = useState(0);
  const [monthTotalAmount, setMonthTotalAmount] = useState(0);
  const [monthTransactionCount, setMonthTransactionCount] = useState(0);
  const [totalAmountAll, setTotalAmountAll] = useState(0);
  const [totalTopupAmountAll, setTotalTopupAmountAll] = useState(0);

  const [stores, setStores] = useState<any[]>([]);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);
  const isSuperAdmin = user.user?.roles?.some((role) => role.id === 1);

  const { openInfoDialog } = useDialog();

  const loadTurnoverData = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchTurnover();
      dispatch(hideLoading());

      if (success && data) {
        if (success && data) {
          setTodayTotalAmount(data.todayTotalAmount);
          setTodayTransactionCount(data.todayTransactionCount);
          setTodayTopupAmount(data.todayTopupAmount);
          setTodayTopupCount(data.todayTopupCount);
          setMonthTotalAmount(data.monthTotalAmount);
          setMonthTransactionCount(data.monthTransactionCount);
          setTotalAmountAll(data.totalDepositAmount);
          setTotalTopupAmountAll(data.totalConsumptionAmount);
        }
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入營收資料',
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

  const loadStores = async () => {
    try {
      dispatch(showLoading());

      // 先檢查 user 資訊是否正確載入
      const userId = user?.user?.id;
      if (!userId) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: '使用者資訊取得失敗，無法載入店家列表',
          confirmText: '我知道了',
        });
        return;
      }

      const response = await fetchStoreListByUserId(userId);
      dispatch(hideLoading());

      if (response.success) {
        setStores(response.data);
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '無法載入店家資訊',
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

  useEffect(() => {
    loadTurnoverData();
    loadStores();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTurnoverData();
      loadStores();
    }, [])
  );

  return (
    <Provider>
      <SharedScreenLayout navigation={navigation} title="管理首頁">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/i-Pool_logo_RGB_2.png')}
                style={styles.headerIcon}
              />
              <Text style={styles.headerTitle}>無人撞球管理系統</Text>
            </View>

            <ScrollView style={styles.mainContainer}>
              <View style={styles.reportSection}>
                <Text style={styles.sectionGroupTitle}>今日營運數據</Text>
                <Text style={styles.reportValue}>
                  消費金額：
                  <NumberFormatter number={todayTotalAmount} /> 元 /
                  <NumberFormatter number={todayTransactionCount} /> 筆
                </Text>
                {isSuperAdmin && (
                  <Text style={styles.reportValue}>
                    儲值金額：
                    <NumberFormatter number={todayTopupAmount} /> 元 /
                    <NumberFormatter number={todayTopupCount} /> 筆
                  </Text>
                )}

                <View style={styles.divider} />

                <Text style={styles.sectionGroupTitle}>本月累計營運</Text>
                <Text style={styles.reportValue}>
                  消費金額：
                  <NumberFormatter number={monthTotalAmount} /> 元 /
                  <NumberFormatter number={monthTransactionCount} /> 筆
                </Text>

                <View style={styles.divider} />

                <Text style={styles.sectionGroupTitle}>所有累計數據</Text>
                <Text style={styles.reportValue}>
                  消費總額：
                  <NumberFormatter number={totalAmountAll} /> 元
                </Text>
                {isSuperAdmin && (
                  <Text style={styles.reportValue}>
                    儲值總額：
                    <NumberFormatter number={totalTopupAmountAll} /> 元
                  </Text>
                )}
              </View>

              <View style={styles.divider} />
              <View style={styles.gridWrapper}>
                {stores.map((item) => (
                  <TouchableOpacity
                    key={item.uid}
                    style={styles.cardWrapper}
                    onPress={() => {
                      (navigation as any).navigate('StoreManagementStack', {
                        screen: 'AdminStoreDetail',
                        params: { store: item },
                      });
                    }}
                  >
                    <Image
                      source={require('../../assets/i-Pool_logo_RGB_1.png')}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SharedScreenLayout>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#595858',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  headerIcon: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#00D4FD',
  },
  mainContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  reportSection: {
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  reportValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#2C9252',
    marginVertical: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 14,
    marginTop: 5,
    color: '#2C3E50',
    textAlign: 'center',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    width: '48%',
    height: 128,
    borderRadius: 20,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: '1%',
    borderWidth: 1,
    borderColor: '#CCCCCC', // 可調整為你想要的顏色
  },
  cardImage: { width: '100%', height: '100%', flex: 1, resizeMode: 'contain' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardWrapper: {
    backgroundColor: '#FFC702',
    width: '48%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  sectionGroupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 10,
  },
});

export default AdminDashboardScreen;
