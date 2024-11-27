import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const menuItems = [
  {
    id: 1,
    title: '訊息通知',
    icon: 'chat',
    badge: 3,
    screen: 'NotificationsScreen',
  },
  {
    id: 2,
    title: '消費記錄',
    icon: 'calendar-today',
    screen: 'TransactionHistoryScreen',
  },
  {
    id: 3,
    title: '帳務資訊',
    icon: 'account-balance',
    screen: 'BillingInfoScreen',
  },
  { id: 4, title: '儲值', icon: 'attach-money', screen: 'RechargeScreen' },
  {
    id: 5,
    title: '登出',
    icon: 'logout',
    color: '#F44336',
    screen: 'LoginScreen',
  },
];

const MemberCenterScreen = ({ navigation }: any) => {
  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => {
        if (item.screen === 'LoginScreen') {
          // 处理登出逻辑
          console.log('Logout pressed');
          // 在实际应用中，清除用户登录状态
        } else {
          navigation.navigate(item.screen); // 跳转到对应的页面
        }
      }}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={item.icon} size={24} color={item.color || '#333'} />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        <Icon name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="會員中心"
        onBackPress={() => navigation.goBack()}
        rightIcon="settings"
        onRightPress={() => console.log('More options pressed')}
        titleColor="#FFF"
        iconColor="#FFF"
      />

      {/* User Info */}
      <View style={styles.userInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Allan</Text>
        <Text style={styles.userBalance}>餘額：1,360元</Text>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  userInfo: {
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBalance: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  menuContainer: {
    padding: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#F44336',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MemberCenterScreen;
