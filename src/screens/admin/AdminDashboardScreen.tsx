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
            <Text style={styles.reportValue}>100,000元 / 1,200筆</Text>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>可提現餘額：</Text>
            <Text style={styles.reportValue}>100,000元</Text>
            <View style={styles.divider} />
          </View>
          {/* Features Section */}
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={styles.featureItem}
                onPress={() => handleFeaturePress(feature)} // Handle feature click
              >
                <Icon name={feature.icon} size={30} color="#000" />
                <Text style={styles.featureText}>{feature.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const features = [
  { icon: 'chart-line', label: '經營報表', route: 'BusinessReport' },
  { icon: 'account-group', label: '會員管理', route: 'MemberManagementScreen' },
  { icon: 'crown', label: '優惠方案設定', route: 'PromotionSettings' },
  { icon: 'pool', label: '桌台管理', route: 'TableManagement' },
  { icon: 'tools', label: '設備管理', route: 'EquipmentManagement' },
  { icon: 'store', label: '我的門店', route: 'MyStore' },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#409D62',
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
    elevation: 3,
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
