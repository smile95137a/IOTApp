import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const CustomDrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerItemsContainer}>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('MemberManagementStack', {
              screen: 'MemberManagement',
            })
          }
        >
          <Icon name="account-group" size={24} color="#333" />
          <Text style={styles.drawerItemText}>會員管理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('VendorManagementStack', {
              screen: 'VendorManagement',
            })
          }
        >
          <Icon name="account-group" size={24} color="#333" />
          <Text style={styles.drawerItemText}>廠商管理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('StoreManagementStack', {
              screen: 'StoreManagement',
            })
          }
        >
          <Icon name="storefront" size={24} color="#333" />
          <Text style={styles.drawerItemText}>店家管理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('PoolTableManagementStack', {
              screen: 'PoolTableManagement',
            })
          }
        >
          <Icon name="table-furniture" size={24} color="#333" />
          <Text style={styles.drawerItemText}>桌檯管理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('BannerManagementStack', {
              screen: 'BannerManagement',
            })
          }
        >
          <Icon name="image" size={24} color="#333" />
          <Text style={styles.drawerItemText}>Banner 管理</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItemColumn}
          onPress={() =>
            props.navigation.navigate('NewsManagementStack', {
              screen: 'NewsManagement',
            })
          }
        >
          <Icon name="newspaper" size={24} color="#333" />
          <Text style={styles.drawerItemText}>最新消息管理</Text>
        </TouchableOpacity>
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
      initialRouteName="AdminDashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          width: 200,
        },
        headerShown: false, // Disable default header globally
      }}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: '管理首頁' }}
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
