import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginHomeScreen from '@/screens/LoginHomeScreen';
import PersonalInformationScreen from '@/screens/PersonalInformationScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginHome" component={LoginHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInformationScreen} />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
