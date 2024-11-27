import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';
import LoginScreen from '@/screens/LoginScreen';
import MemberCenterScreen from '@/screens/MemberCenterScreen';
import StoreScreen from '@/screens/StoreScreen';
import StoreDetailScreen from '@/screens/StoreDetailScreen';
import NewsScreen from '@/screens/NewsScreen';
import NewsDetailScreen from '@/screens/NewsDetailScreen';
import { store } from '@/store/store';
import BillingInfoScreen from '@/screens/BillingInfoScreen';
import NotificationsScreen from '@/screens/NotificationsScreen';
import RechargeScreen from '@/screens/RechargeScreen';
import TransactionHistoryScreen from '@/screens/TransactionHistoryScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import PersonalInformationScreen from '@/screens/PersonalInformationScreen';
import LoginHomeScreen from '@/screens/LoginHomeScreen';
import HomeScreen from '@/screens/HomeScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';

const isLoggedIn = true;

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function StoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreDetailScreen"
        component={StoreDetailScreen}
        options={{ headerShown: false, headerTitle: '門市資訊' }}
      />
    </Stack.Navigator>
  );
}

function NewsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{ headerShown: false, headerTitle: '最新消息' }}
      />
      <Stack.Screen
        name="NewsDetailScreen"
        component={NewsDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MemberStack() {
  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          {/* 會員中心 */}
          <Stack.Screen
            name="MemberCenterScreen"
            component={MemberCenterScreen}
            options={{ headerShown: false }}
          />
          {/* 訊息通知 */}
          <Stack.Screen
            name="NotificationsScreen"
            component={NotificationsScreen}
            options={{ headerShown: false }}
          />
          {/* 消費記錄 */}
          <Stack.Screen
            name="TransactionHistoryScreen"
            component={TransactionHistoryScreen}
            options={{ headerShown: false }}
          />
          {/* 帳務資訊 */}
          <Stack.Screen
            name="BillingInfoScreen"
            component={BillingInfoScreen}
            options={{ headerShown: false }}
          />
          {/* 儲值 */}
          <Stack.Screen
            name="RechargeScreen"
            component={RechargeScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          {/* 登入首頁 */}
          <Stack.Screen
            name="LoginHomeScreen"
            component={LoginHomeScreen}
            options={{ headerShown: false }}
          />
          {/* 登入 */}
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false, headerTitle: '登入' }}
          />
          {/* 註冊 */}
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{ headerShown: false, headerTitle: '註冊' }}
          />

          <Stack.Screen
            name="PersonalInformationScreen"
            component={PersonalInformationScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboardScreen"
        component={AdminDashboardScreen}
        options={{ headerShown: false, headerTitle: '管理後台' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => {
                let iconName;
                switch (route.name) {
                  case '首頁':
                    iconName = 'home-outline';
                    break;
                  case '最新消息':
                    iconName = 'chat-outline';
                    break;
                  case '門市探索':
                    iconName = 'store';
                    break;
                  case '會員':
                    iconName = isLoggedIn
                      ? 'account-circle'
                      : 'account-outline';
                    break;
                  default:
                    iconName = 'home-outline';
                }
                return <Icon name={iconName || ''} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#151D3D',
              tabBarInactiveTintColor: '#8A9493',
              tabBarStyle: {
                backgroundColor: '#f8f9fa',
                height: 60,
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: 'bold',
                marginTop: 5,
              },
            })}
          >
            <Tab.Screen name="首頁" component={HomeScreen} />
            <Tab.Screen name="最新消息" component={NewsStack} />

            <Tab.Screen name="門市探索" component={StoreStack} />
            <Tab.Screen name="會員" component={MemberStack} />
            <Tab.Screen name="後台" component={AdminStack} />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
