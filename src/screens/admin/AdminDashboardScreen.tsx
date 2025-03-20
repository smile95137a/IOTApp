import NumberFormatter from '@/component/NumberFormatter';
import SharedScreenLayout from '@/navigators/SharedScreenLayout';
import { genRandomNumbers } from '@/utils/RandomUtils';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminDashboardScreen = ({ navigation }) => {
  const handleFeaturePress = (feature) => {
    if (feature.route) {
      navigation.navigate(feature.route); // Navigate to the defined route
    }
  };

  return (
    <SharedScreenLayout navigation={navigation} title="管理首頁">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require('@/assets/iot-threeBall.png')}
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>無人撞球管理系統</Text>
          </View>
          <View style={styles.mainContainer}>
            {/* Report Section */}
            <View style={styles.reportSection}>
              <Text style={styles.sectionTitle}>今日收款：</Text>
              <Text style={styles.reportValue}>
                <NumberFormatter number={~~genRandomNumbers(8)} />元 /
                <NumberFormatter number={~~genRandomNumbers(5)} />筆
              </Text>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>可提現餘額：</Text>
              <Text style={styles.reportValue}>
                <NumberFormatter number={~~genRandomNumbers(9)} />元
              </Text>
              <View style={styles.divider} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SharedScreenLayout>
  );
};

const features = [
  { icon: 'chart-line', label: '經營報表', route: 'ReportSummaryScreen' },
  { icon: 'account-group', label: '會員管理', route: 'MemberManagementScreen' },
  { icon: 'crown', label: '優惠方案設定', route: 'PromotionSettingsScreen' },
  { icon: 'pool', label: '桌台管理', route: 'PromotionSettingsScreen' },
  { icon: 'tools', label: '設備管理', route: 'DeviceManagementScreen' },
  { icon: 'store', label: '我的門店', route: 'MyStoreHomeScreen' },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#595858',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  headerIcon: {
    width: 77,
    height: 77,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
