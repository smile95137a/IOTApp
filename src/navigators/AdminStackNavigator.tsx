import React, { useEffect, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import ReportSummaryScreen from '@/screens/admin/ReportSummaryScreen';
import AccountSettingsScreen from '@/screens/admin/AccountSettingsScreen';
import AddPromotionScreen from '@/screens/admin/AddPromotionScreen';
import DeviceManagementScreen from '@/screens/admin/DeviceManagement';
import EditMemberScreen from '@/screens/admin/EditMemberScreen';
import EnvironmentManagementScreen from '@/screens/admin/EnvironmentManagementScreen';
import MemberDetailsScreen from '@/screens/admin/MemberDetailsScreen';
import MemberManagementScreen from '@/screens/admin/MemberManagementScreen';
import MyStoreHomeScreen from '@/screens/admin/MyStoreHomeScreen';
import PermissionSettingsScreen from '@/screens/admin/PermissionSettingsScreen';
import PromotionSettingsScreen from '@/screens/admin/PromotionSettingsScreen';
import StoreSettingsScreen from '@/screens/admin/StoreSettingsScreen';
import TableDetailsScreen from '@/screens/admin/TableDetailsScreen';
import TableManagementScreen from '@/screens/admin/TableManagementScreen';
import VendorManagementScreen from '@/screens/admin/VendorManagementScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AddVendorScreen from '@/screens/admin/AddVendorScreen';
import StoreManagementScreen from '@/screens/admin/StoreManagementScreen';
import AddStoreScreen from '../screens/admin/AddStoreScreen';
import PoolTableManagementScreen from '@/screens/admin/PoolTableManagementScreen';
import AddPoolTableScreen from '../screens/admin/AddPoolTableScreen';
import AddBannerScreen from '@/screens/admin/AddBannerScreen';
import AddNewsScreen from '@/screens/admin/AddNewsScreen';
import BannerManagementScreen from '@/screens/admin/BannerManagementScreen';
import NewsManagementScreen from '@/screens/admin/NewsManagementScreen';
import { fetchAllBanners } from '@/api/bannerApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchAllMenus } from '@/api/admin/menuApi';
import EquipmentManagementScreen from '@/screens/admin/EquipmentManagementScreen';
import StoreEquipmentEdit from '@/screens/admin/StoreEquipmentEdit';
import DeviceTableManagementScreen from '@/screens/admin/DeviceTableManagementScreen';
import EnvironmentTableManagementScreen from '@/screens/admin/EnvironmentTableManagementScreen';
import ReportVendorScreen from '@/screens/admin/ReportVendorScreen';
import ReportStoreScreen from '@/screens/admin/ReportStoreScreen';
import ReportDetailScreen from '@/screens/admin/ReportDetailScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const menuItems = {
  dashboard: {
    stack: 'DashboardStack',
    screen: 'Dashboard',
    icon: 'view-dashboard',
    label: '管理首頁',
  },
  member: {
    stack: 'MemberManagementStack',
    screen: 'MemberManagement',
    icon: 'account-group',
    label: '會員管理',
  },
  vendor: {
    stack: 'VendorManagementStack',
    screen: 'VendorManagement',
    icon: 'account-group',
    label: '廠商管理',
  },
  store: {
    stack: 'StoreManagementStack',
    screen: 'StoreManagement',
    icon: 'storefront',
    label: '店家管理',
  },
  poolTable: {
    stack: 'PoolTableManagementStack',
    screen: 'PoolTableManagement',
    icon: 'table-furniture',
    label: '桌檯管理',
  },
  banner: {
    stack: 'BannerManagementStack',
    screen: 'BannerManagement',
    icon: 'image',
    label: 'Banner 管理',
  },
  news: {
    stack: 'NewsManagementStack',
    screen: 'NewsManagement',
    icon: 'newspaper',
    label: '最新消息管理',
  },
  equipment: {
    stack: 'EquipmentStack',
    screen: 'EquipmentManagement',
    icon: 'wrench',
    label: '設備管理',
  },
  report: {
    stack: 'ReportStack',
    screen: '',
    icon: 'chart-bar',
    label: '報表管理',
  },
  monitor: {
    stack: 'MonitorStack',
    screen: 'MonitorManagement',
    icon: 'cctv',
    label: '攝影機',
  },
};

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [menus, setMenus] = useState([]); // 改變名稱以符合邏輯

  const loadMenus = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllMenus();

      dispatch(hideLoading());
      if (success) {
        const sortedMenus = data.sort((a, b) => a.menuOrder - b.menuOrder);
        setMenus(sortedMenus);
      } else {
        Alert.alert('錯誤', message || '無法載入選單');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerItemsContainer}>
        {menus.map((menu) => {
          const key = menu.url;
          const menuItem = menuItems[key]; // 取得 menuItems 內的物件

          if (!menuItem) return null; // 若沒有找到對應的 key，就不顯示這個項目

          return (
            <TouchableOpacity
              key={menu.id}
              style={styles.drawerItemColumn}
              onPress={() =>
                props.navigation.navigate(menuItem.stack, {
                  screen: menuItem.screen,
                })
              }
            >
              <Icon name={menuItem.icon} size={24} color="#333" />
              <Text style={styles.drawerItemText}>{menuItem.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.drawerItemColumn, styles.logoutButton]}
        onPress={() => props.navigation.navigate('Main')}
      >
        <Icon name="logout" size={24} color="#F44336" />
        <Text style={[styles.drawerItemText, styles.logoutText]}>回首頁</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="DashboardStack"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 200,
        },
        headerShown: false, // Disable default header globally
      }}
    >
      <Drawer.Screen
        name="DashboardStack"
        component={DashboardStack}
        options={{ headerShown: false, title: '管理首頁' }}
      />
      <Drawer.Screen
        name="MemberManagementStack"
        component={MemberStack}
        options={{ headerShown: false, title: '會員管理' }}
      />
      <Drawer.Screen
        name="VendorManagementStack"
        component={VendorStack}
        options={{ headerShown: false, title: '廠商管理' }}
      />
      <Drawer.Screen
        name="StoreManagementStack"
        component={StoreStack}
        options={{ headerShown: false, title: '店家管理' }}
      />
      <Drawer.Screen
        name="PoolTableManagementStack"
        component={PoolTableStack}
        options={{ headerShown: false, title: '桌檯管理' }}
      />
      <Drawer.Screen
        name="BannerManagementStack"
        component={BannerStack}
        options={{ headerShown: false, title: 'Banner 管理' }}
      />
      <Drawer.Screen
        name="NewsManagementStack"
        component={NewsStack}
        options={{ headerShown: false, title: '最新消息管理' }}
      />
      <Drawer.Screen
        name="EquipmentStack"
        component={EquipmentStack}
        options={{ headerShown: false, title: '設備管理' }}
      />
      <Drawer.Screen
        name="ReportStack"
        component={ReportStack}
        options={{ headerShown: false, title: '設備管理' }}
      />
      <Drawer.Screen
        name="MonitorStack"
        component={MonitorStack}
        options={{ headerShown: false, title: '攝影機管理' }}
      />
    </Drawer.Navigator>
  );
};
const VendorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VendorManagement"
        component={VendorManagementScreen}
        options={{ title: '廠商管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="AddVendor"
        component={AddVendorScreen}
        options={{ title: '新增廠商' }} // 讓返回按鈕可用
      />
    </Stack.Navigator>
  );
};
const MonitorStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MonitorView"
        component={MonitorViewScreen}
        options={{ title: '攝影機管理', headerShown: false }}
      />
      <Stack.Screen
        name="MonitorViewDetail"
        component={MonitorViewDetailScreen}
        options={{ title: '攝影機管理', headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const DashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={AdminDashboardScreen}
        options={{ title: '店家管理', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const StoreStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StoreManagement"
        component={StoreManagementScreen}
        options={{ title: '店家管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="AddStore"
        component={AddStoreScreen}
        options={{ title: '新增店家' }} // 讓返回按鈕可用
      />
    </Stack.Navigator>
  );
};

const PoolTableStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PoolTableManagement"
        component={PoolTableManagementScreen}
        options={{ title: '桌檯管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="AddPoolTable"
        component={AddPoolTableScreen}
        options={{ title: '新增/編輯桌檯' }}
      />
    </Stack.Navigator>
  );
};

const MemberStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MemberManagement"
        component={MemberManagementScreen}
        options={{ title: '會員管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="MemberDetails"
        component={MemberDetailsScreen}
        options={{ title: '會員管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="EditMember"
        component={EditMemberScreen}
        options={{ title: '會員管理', headerShown: false }} // 隱藏 Header
      />
    </Stack.Navigator>
  );
};

// Banner 管理 Stack
const BannerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BannerManagement"
        component={BannerManagementScreen}
        options={{ title: 'Banner 管理', headerShown: false }}
      />
      <Stack.Screen
        name="AddBanner"
        component={AddBannerScreen}
        options={{ title: '新增 Banner' }}
      />
    </Stack.Navigator>
  );
};

// 最新消息管理 Stack
const NewsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewsManagement"
        component={NewsManagementScreen}
        options={{ title: '最新消息管理', headerShown: false }}
      />
      <Stack.Screen
        name="AddNews"
        component={AddNewsScreen}
        options={{ title: '新增消息' }}
      />
    </Stack.Navigator>
  );
};
const EquipmentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EquipmentManagement"
        component={EquipmentManagementScreen}
        options={{ title: '設備管理', headerShown: false }} // 隱藏 Header
      />
      <Stack.Screen
        name="StoreEquipmentEdit"
        component={StoreEquipmentEdit}
        options={{ title: '店家設備管理' }}
      />
      <Stack.Screen
        name="DeviceManagement"
        component={DeviceManagementScreen}
        options={{ title: '店家設備管理', headerShown: false }}
      />

      <Stack.Screen
        name="EnvironmentManagement"
        component={EnvironmentManagementScreen}
        options={{ title: '店家設備管理', headerShown: false }}
      />
      <Stack.Screen
        name="MonitorManagement"
        component={MonitorManagementScreen}
        options={{ title: '店家設備管理', headerShown: false }}
      />
      <Stack.Screen
        name="DeviceTableManagement"
        component={DeviceTableManagementScreen}
        options={{ title: '店家設備管理', headerShown: false }}
      />
      <Stack.Screen
        name="EnvironmentTableManagement"
        component={EnvironmentTableManagementScreen}
        options={{ title: '店家設備管理', headerShown: false }}
      />
    </Stack.Navigator>
  );
};

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import MonitorManagementScreen from '@/screens/admin/MonitorManagementScreen';
import MonitorViewScreen from '@/screens/admin/MonitorViewScreen';
import MonitorViewDetailScreen from '@/screens/admin/MonitorViewDetailScreen';

const ReportStack = () => {
  const user = useSelector((state: RootState) => state.user);
  const isAdmin = user.user?.roles?.map((x) => x.id).includes(1);

  return (
    <Stack.Navigator>
      {isAdmin && (
        <Stack.Screen
          name="ReportVendor"
          component={ReportVendorScreen}
          options={{ title: '報表總覽', headerShown: false }}
        />
      )}
      <Stack.Screen
        name="ReportStore"
        component={ReportStoreScreen}
        options={{ title: '報表總覽', headerShown: false }}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{ title: '報表詳情' }} // 讓返回按鈕可用
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerItemsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  drawerItemColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerItemText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 30,
  },
  logoutText: {
    color: '#F44336',
  },
});

export default AdminDrawerNavigator;
