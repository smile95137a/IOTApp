import { fetchUserInfo } from '@/api/userApi';
import Header from '@/component/Header';
import { logOut } from '@/store/authSlice';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { RootState } from '@/store/store';
import { setUser } from '@/store/userSlice';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

const menuItems = [
  {
    id: 1,
    title: '訊息通知',
    icon: 'chat',
    // badge: 3,
    screen: 'Notifications',
  },
  {
    id: 2,
    title: '消費記錄',
    icon: 'calendar-today',
    screen: 'TransactionHistory',
  },
  {
    id: 22,
    title: '儲值記錄',
    icon: 'history',
    screen: 'DepositHistory',
  },
  {
    id: 322,
    title: '開局記錄',
    icon: 'history',
    screen: 'GameHistory',
  },
  { id: 3, title: '儲值', icon: 'attach-money', screen: 'Recharge' },
  {
    id: 4,
    title: '前往後台',
    icon: 'admin-panel-settings',
    color: '#3F51B5',
    screen: 'Admin',
    authRoleId: [1, 2],
  },
  {
    id: 5,
    title: '登出',
    icon: 'logout',
    color: '#F44336',
    screen: 'LoginScreen',
  },
];

const MemberCenterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user); // Get user from Redux

  const [localUser, setLocalUser] = useState(user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      const getUserInfo = async () => {
        if (user) {
          setLocalUser(user);

          return;
        }

        try {
          dispatch(showLoading());
          const response = await fetchUserInfo();
          dispatch(hideLoading());

          if (response.success) {
            console.log('[User Info] API Response:', response.data);
            dispatch(setUser(response.data));
            setLocalUser(response.data);
          } else {
            console.warn('[User Info] Fetch failed:', response.message);
          }
        } catch (error) {
          dispatch(hideLoading());

          console.error('[User Info] Fetch error:', error);
        }
      };

      getUserInfo();
    }
  }, [user]);

  const handleLogOut = () => {
    dispatch(logOut());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const renderMenuItem = ({ item }: { item: any }) => {
    // 取得當前選單項目的權限角色
    const authRoleId = item.authRoleId;

    // 取得使用者的角色 ID 陣列
    const roleIds = localUser?.roles?.map((role) => role.id) || [];

    // 若該選單項目需要特定權限，但當前使用者沒有，則不顯示
    if (authRoleId && !authRoleId.some((id) => roleIds.includes(id))) {
      return null;
    }
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (item.screen === 'LoginScreen') {
            handleLogOut();
          } else {
            navigation.navigate(item.screen);
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
  };

  return (
    <>
      <FlatList
        windowSize={1}
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </>
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
