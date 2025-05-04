import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import MemberStack from './MemberStack';
import NewsStack from './NewsStack';
import StoreStack from './StoreStack';

const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIconStyle: styles.tabIcon,
          tabBarActiveTintColor: '#151D3D',
          tabBarInactiveTintColor: '#8A9493',
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '首頁',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          })}
        />
        <Tab.Screen
          name="News"
          component={NewsStack}
          options={{
            tabBarLabel: '最新消息',
            tabBarIcon: ({ color, size }) => (
              <Feather name="star" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'News' }],
              });
            },
          })}
        />
        <Tab.Screen
          name="Recharge"
          component={MemberStack}
          options={{
            tabBarLabel: '儲值',
            tabBarIcon: ({ color, size }) => (
              <Feather name="dollar-sign" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              (navigation as any).reset({
                index: 0,
                routes: [
                  {
                    name: 'Member',
                    state: {
                      routes: [{ name: 'Recharge' }],
                    },
                  },
                ],
              });
            },
          })}
        />

        <Tab.Screen
          name="Explore"
          component={StoreStack}
          options={{
            tabBarLabel: '門市探索',
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Explore' }],
              });
            },
          })}
        />
        <Tab.Screen
          name="Member"
          component={MemberStack}
          options={{
            tabBarLabel: '會員',
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'Member' }],
              });
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: '#fff',
    height: 80,
    paddingBottom: 5,
  },
  tabIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  tabLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  cameraButtonWrapper: {
    position: 'absolute',
    top: -20,
    left: '50%',
    transform: [{ translateX: -35 }],
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
  },
  cameraButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFC702',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  cameraImage: {
    width: 48,
    height: 48,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
});

export default MainStackNavigator;
