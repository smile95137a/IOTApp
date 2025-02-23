import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainStackNavigator from '@/navigators/MainStackNavigator';
import AuthStackNavigator from '@/navigators/AuthStackNavigator';
import AdminStackNavigator from '@/navigators/AdminStackNavigator';
import LoadingMask from '@/component/LoadingMask';
import { useDispatch } from 'react-redux';
import { loadAuthState } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';

const Tab = createBottomTabNavigator();

const RootStackNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadAuthState());
  }, []);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tab.Screen name="Main" component={MainStackNavigator} />
        <Tab.Screen name="Auth" component={AuthStackNavigator} />
        <Tab.Screen name="Admin" component={AdminStackNavigator} />
      </Tab.Navigator>
    </>
  );
};

export default RootStackNavigator;
