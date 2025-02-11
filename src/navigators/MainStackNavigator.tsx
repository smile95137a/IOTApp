import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '@/screens/HomeScreen';
import NewsStack from '@/navigators/NewsStack';
import MemberStack from '@/navigators/MemberStack';
import StoreStack from './StoreStack';
import CameraStack from './CameraStack';
import { useNavigation } from '@react-navigation/native';
import { openCamera } from '@/store/cameraSlice';
import { useDispatch } from 'react-redux';

const Tab = createBottomTabNavigator();

const MainStackNavigator = () => {
  const dispatch = useDispatch();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
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
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsStack}
        options={{
          tabBarLabel: '最新消息',
          tabBarIcon: ({ color, size }) => (
            <Icon name="star" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Camera"
        component={CameraStack}
        options={{
          tabBarLabel: '',
          tabBarButton: () => {
            const navigation = useNavigation();
            return (
              <View style={styles.cameraButtonWrapper}>
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={() => {
                    dispatch(openCamera());
                    navigation.navigate('Camera');
                  }}
                >
                  <Image
                    source={require('@/assets/iot-camera-logo.png')}
                    style={styles.cameraImage}
                  />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Explore"
        component={StoreStack}
        options={{
          tabBarLabel: '門市探索',
          tabBarIcon: ({ color, size }) => (
            <Icon name="explore" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Member"
        component={MemberStack}
        options={{
          tabBarLabel: '會員',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  cameraButtonWrapper: {
    position: 'absolute',
    top: -30,
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
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#DFECE4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
  },
  cameraImage: {
    width: 63,
    height: 63,
  },
});

export default MainStackNavigator;
