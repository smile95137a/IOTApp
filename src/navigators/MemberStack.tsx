import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigation } from '@react-navigation/native';
import Header from '@/component/Header';
import MemberCenterScreen from '@/screens/memner-center/MemberCenterScreen';
import NotificationsScreen from '@/screens/memner-center/NotificationsScreen';
import TransactionHistoryScreen from '@/screens/memner-center/TransactionHistoryScreen';
import RechargeScreen from '@/screens/memner-center/RechargeScreen';
import PaymentScreen from '@/screens/memner-center/PaymentScreen';
import ReservationScreen from '@/screens/memner-center/ReservationScreen';
import PaymentSuccessScreen from '@/screens/memner-center/PaymentSuccessScreen';
import ContactScreen from '@/screens/memner-center/ContactScreen';
import { fetchUserInfo, User } from '@/api/userApi';
import NumberFormatter from '@/component/NumberFormatter';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import RechargeSuccess from '@/screens/memner-center/RechargeSuccess';
import { clearUser, setUser } from '@/store/userSlice';
import DepositHistoryScreen from '@/screens/memner-center/DepositHistoryScreen';
import GameHistoryScreen from '@/screens/memner-center/GameHistoryScreen';
import { getImageUrl } from '@/utils/ImageUtils';
import EditPersonalInfoScreen from '@/screens/memner-center/EditPersonalInfoScreen';
import { LinearGradient } from 'expo-linear-gradient';
import GameOngoingScreen from '@/screens/memner-center/GameOngoingScreen';
import MyBookHistoryScreen from '@/screens/memner-center/MyBookHistoryScreen';

const Stack = createStackNavigator();

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user); // Get user from Redux

  const [localUser, setLocalUser] = useState(user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      const getUserInfo = async () => {
        if (user) {
          setLocalUser(user);

          return;
        }

        try {
          dispatch(showLoading());
          const response = await fetchUserInfo();
          dispatch(hideLoading());

          if (response.success) {
            console.log('[User Info] API Response:', response.data);
            dispatch(setUser(response.data));
            setLocalUser(response.data);
          } else {
            console.warn('[User Info] Fetch failed:', response.message);
          }
        } catch (error) {
          dispatch(hideLoading());

          console.error('[User Info] Fetch error:', error);
        }
      };

      getUserInfo();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1D1640', '#4067A4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Header
            title="會員中心"
            onBackPress={() => navigation.goBack()}
            isDarkMode
          />

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoLeft}>
              <Image
                src={getImageUrl(localUser?.imgUrl)}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userInfoRight}>
              <Text style={styles.userName}>{localUser?.name || ''}</Text>
              <Text style={styles.userBalance}>
                餘額：
                <NumberFormatter number={localUser?.amount ?? 0} />元
              </Text>
            </View>
          </View>

          {/* Menu List */}
          <View style={styles.menuContainer}>{children}</View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const MemberStack = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.navigate('Auth'); // 確保 AuthStack 在 RootNavigator 中已定義
    }

    return () => {
      console.log('[MemberStack] Unmounting, clearing user data');
      dispatch(clearUser());
    };
  }, [isLoggedIn, navigation, dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="MemberCenter">
        {(props) => (
          <MainLayout>
            <MemberCenterScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="EditPersonalInfo">
        {(props) => (
          <MainLayout>
            <EditPersonalInfoScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Notifications">
        {(props) => (
          <MainLayout>
            <NotificationsScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="DepositHistory">
        {(props) => (
          <MainLayout>
            <DepositHistoryScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="TransactionHistory">
        {(props) => (
          <MainLayout>
            <TransactionHistoryScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="GameOngoing">
        {(props) => (
          <MainLayout>
            <GameOngoingScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="GameHistory">
        {(props) => (
          <MainLayout>
            <GameHistoryScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="MyBookHistory">
        {(props) => (
          <MainLayout>
            <MyBookHistoryScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="Recharge">
        {(props) => (
          <MainLayout>
            <RechargeScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Payment">
        {(props) => (
          <MainLayout>
            <PaymentScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentSuccess">
        {(props) => (
          <MainLayout>
            <PaymentSuccessScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Reservation">
        {(props) => (
          <MainLayout>
            <ReservationScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>

      <Stack.Screen name="Contact">
        {(props) => (
          <MainLayout>
            <ContactScreen {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="RechargeSuccess">
        {(props) => (
          <MainLayout>
            <RechargeSuccess {...props} />
          </MainLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  userInfoLeft: {
    marginRight: 20,
  },
  userInfoRight: {},
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F2BF04',
  },
  userBalance: {
    fontSize: 12,
    color: '#F2BF04',
    marginTop: 5,
  },
  menuContainer: {
    padding: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FAFAFA',
    flex: 1,
  },
});

export default MemberStack;
