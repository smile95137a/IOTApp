import { fetchTurnover } from '@/api/admin/turnoverApi';
import NumberFormatter from '@/component/NumberFormatter';
import SharedScreenLayout from '@/navigators/SharedScreenLayout';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';

const AdminDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [todayTotalAmount, setTodayTotalAmount] = useState(0);
  const [todayTransactionCount, setTodayTransactionCount] = useState(0);
  const loadTurnoverData = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchTurnover();
      dispatch(hideLoading());

      if (success && data) {
        setTodayTotalAmount(data.todayTotalAmount);
        setTodayTransactionCount(data.todayTransactionCount);
      } else {
        Alert.alert('錯誤', message || '無法載入營收資料');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadTurnoverData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTurnoverData();
    }, [])
  );

  return (
    <SharedScreenLayout navigation={navigation} title="管理首頁">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/iot-logo-no-text.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>無人撞球管理系統</Text>
          </View>

          <View style={styles.mainContainer}>
            {/* Report Section */}
            <View style={styles.reportSection}>
              <Text style={styles.sectionTitle}>今日收款：</Text>
              <Text style={styles.reportValue}>
                <NumberFormatter number={todayTotalAmount} />元 /
                <NumberFormatter number={todayTransactionCount} />筆
              </Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SharedScreenLayout>
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
  },
  reportSection: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
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
});

export default AdminDashboardScreen;
