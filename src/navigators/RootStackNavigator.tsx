import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import CropImageScreen from '../component/CropImageScreen';
import { loadAuthState } from '../store/authSlice';
import { AppDispatch } from '../store/store';
import AdminStackNavigator from './AdminStackNavigator';
import AuthStackNavigator from './AuthStackNavigator';
import CameraStack from './CameraStack';
import MainStackNavigator from './MainStackNavigator';

const Tab = createBottomTabNavigator();

const RootStackNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadAuthState());
  }, [dispatch]);

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
        <Tab.Screen name="Camera" component={CameraStack} />
        <Tab.Screen name="CropImage" component={CropImageScreen} />
      </Tab.Navigator>
    </>
  );
};

export default RootStackNavigator;
