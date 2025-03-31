import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import LoginHomeScreen from '@/screens/LoginHomeScreen';
import RegisterPersonalInformationScreen from '@/screens/RegisterPersonalInformationScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginHome" component={LoginHomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen
        name="PersonalInfo"
        component={RegisterPersonalInformationScreen}
      />
    </Stack.Navigator>
  );
};

export default AuthStackNavigator;
