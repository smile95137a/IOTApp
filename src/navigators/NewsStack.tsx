import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NewsScreen from '@/screens/NewsScreen';
import NewsDetailScreen from '@/screens/NewsDetailScreen';

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
