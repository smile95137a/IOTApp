import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchUserInfo, uploadProfileImage } from '../api/userApi';
import NumberFormatter from '../component/NumberFormatter';
import { useInfoDialog } from '../hooks/useInfoDialog';
import ContactScreen from '../screens/memner-center/ContactScreen';
import DepositHistoryScreen from '../screens/memner-center/DepositHistoryScreen';
import EditPersonalInfoScreen from '../screens/memner-center/EditPersonalInfoScreen';
import GameHistoryScreen from '../screens/memner-center/GameHistoryScreen';
import GameOngoingScreen from '../screens/memner-center/GameOngoingScreen';
import MemberCenterScreen from '../screens/memner-center/MemberCenterScreen';
import MyBookHistoryScreen from '../screens/memner-center/MyBookHistoryScreen';
import NotificationsScreen from '../screens/memner-center/NotificationsScreen';
import PaymentSuccessScreen from '../screens/memner-center/PaymentSuccessScreen';
import RechargeScreen from '../screens/memner-center/RechargeScreen';
import RechargeSuccess from '../screens/memner-center/RechargeSuccess';
import ReservationScreen from '../screens/memner-center/ReservationScreen';
import TransactionHistoryScreen from '../screens/memner-center/TransactionHistoryScreen';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { RootState } from '../store/store';
import { setUser, clearUser } from '../store/userSlice';
import { getErrorMessage } from '../utils/errorUtils';
import { getImageUrl } from '../utils/ImageUtils';
import * as ImagePicker from 'expo-image-picker';
import Header from '../component/Header';
import PaymentScreen from '../screens/memner-center/PaymentScreen';
const Stack = createStackNavigator();

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const currentScreenName = route.name;

  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.user.user);

  const [localUser, setLocalUser] = useState(user);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const { openInfoDialog } = useInfoDialog();
  const selectedStore = useSelector(
    (state: RootState) => state.storeSelection.selectedStore
  );
  const fetchAndSetUserInfo = async () => {
    try {
      dispatch(showLoading());
      const response = await fetchUserInfo();
      dispatch(hideLoading());

      if (response.success) {
        dispatch(setUser(response.data));
        setLocalUser(response.data);
      } else {
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (user) {
        setLocalUser(user);
      } else {
        fetchAndSetUserInfo();
      }
    }
  }, [user, isLoggedIn]);

  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相簿權限',
        confirmText: '我知道了',
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        isCircle: true,
        from: {
          tab: 'Main',
          stack: 'Member',
          screen: 'MemberCenter',
        },
      });
    }

    if (!result.canceled) {
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相機權限',
        confirmText: '我知道了',
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        isCircle: true,
        from: {
          tab: 'Main',
          stack: 'Member',
          screen: 'MemberCenter',
        },
      });
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert('選擇頭像', '請選擇照片來源', [
      { text: '拍照', onPress: handleTakePhoto },
      { text: '從相簿選擇', onPress: handleUploadPhoto },
      { text: '取消', style: 'cancel' },
    ]);
  };

  useEffect(() => {
    const croppedImageUri = route.params?.croppedImageUri;
    if (croppedImageUri && user?.id) {
      const upload = async () => {
        dispatch(showLoading());
        const uploadSuccess = await uploadProfileImage(
          user.id,
          croppedImageUri
        );
        dispatch(hideLoading());

        if (!uploadSuccess) {
          openInfoDialog({
            title: '錯誤',
            content: '頭像上傳失敗，請稍後重試',
          });
        } else {
          console.log('[Upload] 頭像上傳成功');
          await fetchAndSetUserInfo();
        }
      };
      upload();
    }
  }, [route.params?.croppedImageUri]);

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
            onBackPress={() => (navigation as any).goBack()}
            isDarkMode
          />

          {/* User Info */}
          <View style={styles.userInfoContainer}>
            <View style={styles.userInfoLeft}>
              <TouchableOpacity onPress={handleChangeAvatar}>
                {localUser?.imgUrl ? (
                  <Image
                    source={{ uri: getImageUrl(localUser.imgUrl) }}
                    style={styles.avatar}
                  />
                ) : localUser?.gender === 'female' ? (
                  <Image
                    source={require('../assets/iot-girl.png')}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../assets/iot-boy.png')}
                    style={styles.avatar}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoRight}>
              <Text style={styles.userName}>
                會員：{localUser?.anonymousId || localUser?.name}
              </Text>
              <Text style={styles.userBalance}>
                儲值金額：
                <NumberFormatter number={localUser?.amount ?? 0} />
                （消費優先扣除）
              </Text>
              <Text style={styles.userBalance}>
                贈送：
                <NumberFormatter number={localUser?.point ?? 0} />
              </Text>
              <Text style={styles.userBalance}>
                可用餘額：
                <NumberFormatter number={localUser?.balance ?? 0} />
              </Text>
            </View>
          </View>
          {/* Store Info */}
          {currentScreenName === 'Payment' && selectedStore && (
            <View style={styles.storeInfoContainer}>
              <Text style={styles.storeTitle}>{selectedStore.name}</Text>
            </View>
          )}

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
      (navigation as any).navigate('Auth'); // 確保 AuthStack 在 RootNavigator 中已定義
    }

    return () => {
      console.log('[MemberStack] Unmounting, clearing user data');
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
  storeInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  storeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
});

export default MemberStack;
