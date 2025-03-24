import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CameraScreen from '@/screens/CameraScreen';

const Stack = createStackNavigator();

const CameraStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default CameraStack;
