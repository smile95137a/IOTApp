import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreScreen from '@/screens/StoreScreen';
import StoreDetailScreen from '@/screens/StoreDetailScreen';
import { useNavigation } from '@react-navigation/native';
import BookStoreScreen from '@/screens/BookStoreScreen';
import BookStoreDetailScreen from '@/screens/BookStoreDetailScreen';
import BookStoreDetailSelectedDateScreen from '@/screens/BookStoreDetailSelectedDateScreen';
import BookStoreDetailSelectedTimeScreen from '@/screens/BookStoreDetailSelectedTimeScreen';

const Stack = createStackNavigator();

const StoreStack = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Explore' }],
      });
    });

    return unsubscribe;
  }, [navigation]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen
        name="Store"
        component={StoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StoreDetail"
        component={StoreDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookStore"
        component={BookStoreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookStoreDetail"
        component={BookStoreDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookStoreDetailSelectedDate"
        component={BookStoreDetailSelectedDateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookStoreDetailSelectedTime"
        component={BookStoreDetailSelectedTimeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default StoreStack;
