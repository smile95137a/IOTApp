import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsDetailScreen from '../screens/NewsDetailScreen';
import NewsScreen from '../screens/NewsScreen';

const Stack = createStackNavigator();

const NewsStack = () => {
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
};

export default NewsStack;
