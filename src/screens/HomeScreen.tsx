import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import ImageCarousel from '@/component/ImageCarousel';
import Header from '@/component/Header';
import * as Location from 'expo-location';
import { findNearestStores } from '@/utils/LocationUtils';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { fetchAllStores } from '@/api/storeApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import HomeOptionButton from '@/component/home/HomeOptionButton';
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [stores, setStores] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<{
    latitude?: number;
    longitude?: number;
  }>({});
  const [nearStores, setNearStores] = useState<any[]>([]);

  useEffect(() => {
    loadStores();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('錯誤', '未授予 GPS 權限');
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    setLocationData({ latitude, longitude });
  };

  const loadStores = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllStores();
      dispatch(hideLoading());
      if (success) {
        setStores(data);
      } else {
        console.log('錯誤', message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.log('錯誤', errorMessage);
    }
  };

  useEffect(() => {
    if (locationData.latitude && locationData.longitude && stores.length > 0) {
      const nearest = findNearestStores(
        locationData.latitude,
        locationData.longitude,
        stores
      );
      setNearStores(nearest.slice(0, 2));
    }
  }, [locationData, stores]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#1D1640', '#4067A4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Header isDarkMode />

          <ScrollView contentContainerStyle={styles.content}>
            <ImageCarousel />
            <HomeOptionButton
              icon={<MaterialIcons name="storefront" size={36} color="black" />}
              title="門市探索"
              description={
                nearStores.length > 0
                  ? `最近據點:${nearStores
                      .map(
                        (store) =>
                          `${store.name} ${store.distance.toFixed(1)} km`
                      )
                      .join('、')}`
                  : '無法獲取最近的店家'
              }
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Explore' }],
                });
              }}
            />
            <HomeOptionButton
              icon={<AntDesign name="scan1" size={36} color="black" />}
              title="掃碼開台"
              description="掃描球桌上的 QRcode 開台／關台"
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Camera' }],
                });
              }}
            />
            <HomeOptionButton
              icon={
                <MaterialIcons name="access-time" size={36} color="black" />
              }
              title="預約開台"
              description="選擇門市預約開台"
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Explore',
                      state: {
                        index: 0,
                        routes: [{ name: 'BookStore' }],
                      },
                    },
                  ],
                });
              }}
            />
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  content: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rowGap: {
    gap: 16, // 增加橘色與藍色卡片之間的間距
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greenCard: {
    backgroundColor: '#65BC85',
    paddingHorizontal: 32,
    paddingVertical: 32,
  },
  orangeCard: {
    backgroundColor: '#F67943',
  },
  blueCard: {
    backgroundColor: '#4285F4',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftImage: {
    width: 106,
    height: 106,
    resizeMode: 'contain',
    marginRight: 40,
  },
  rightContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  textContent: {
    marginBottom: 10,
  },
  cardContentCentered: {
    alignItems: 'center', // 致中對齊
    justifyContent: 'center', // 垂直居中
    flex: 1,
  },
  centerClass: {
    textAlign: 'center',
  },
  cardImage: {
    width: 114,
    height: 114,
    marginBottom: 10,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  cardText: {
    color: '#fff',
  },
  cardButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
});

export default HomeScreen;
