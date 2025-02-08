import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreScreen from '@/screens/StoreScreen';
import StoreDetailScreen from '@/screens/StoreDetailScreen';
import { useNavigation } from '@react-navigation/native';

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
        options={{ headerShown: false, headerTitle: '門市資訊' }}
      />
    </Stack.Navigator>
  );
};

export default StoreStack;
