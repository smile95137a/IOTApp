import { fetchAllStores } from '@/api/storeApi';
import Header from '@/component/Header';
import ImageCarousel from '@/component/ImageCarousel';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import { findNearestStores } from '@/utils/LocationUtils';
import { getImageUrl } from '@/utils/ImageUtils';
import { LinearGradient } from 'expo-linear-gradient';

const StoreScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const [stores, setStores] = useState<any[]>([]);
  const [isLoadGps, setIsLoadGps] = useState(false);
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
    setIsLoadGps(true);
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
      console.log(
        '錯誤',
        error instanceof Error ? error.message : String(error)
      );
    }
  };

  useEffect(() => {
    if (stores.length > 0) {
      const latitude = locationData.latitude || 0;
      const longitude = locationData.longitude || 0;
      setNearStores(findNearestStores(latitude, longitude, stores));
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
          <Header title="預約開台" isDarkMode />
          <ImageCarousel />
          <ScrollView contentContainerStyle={styles.storeList}>
            {nearStores.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.storeItem}
                onPress={() =>
                  navigation.navigate('BookStoreDetail', { store: item })
                }
              >
                <View style={styles.storeImageContainer}>
                  <View style={styles.storeImageMain}>
                    <Image
                      src={getImageUrl(item?.imgUrl)}
                      style={styles.storeImage}
                    />
                  </View>
                </View>
                <View style={styles.storeDetails}>
                  <Text style={styles.storeName}>{item.name}</Text>
                  <Text style={styles.storeAddress}>{item.address}</Text>
                  {isLoadGps && (
                    <Text style={styles.storeDistance}>
                      {item.distance.toFixed(1)} km
                    </Text>
                  )}
                </View>
                <View style={[styles.storeVisit, styles.tableYellow]}>
                  <Text style={[styles.storeVisitText, styles.storeVisitText1]}>
                    桌數
                  </Text>
                  <Text style={[styles.storeVisitText, styles.storeVisitText2]}>
                    {item.availablesCount + item.inusesCount}
                  </Text>
                  <View style={styles.storeVisitContainer}>
                    <Text
                      style={[styles.storeVisitText, styles.storeVisitText3]}
                    >
                      查看
                    </Text>
                    <Text
                      style={[styles.storeVisitText, styles.storeVisitText4]}
                    >
                      <Icon name="chevron-right" size={18} />
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  storeList: {},
  storeItem: {
    flexDirection: 'row',
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    marginBottom: 10,
    height: 106,
    overflow: 'hidden',
  },
  storeImageContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeImageMain: {
    width: 70,
    height: 70,
    borderRadius: 200,
    backgroundColor: '#000A30',
    overflow: 'hidden',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  storeDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeAddress: {
    fontSize: 14,
  },
  storeDistance: {
    fontSize: 12,
    marginTop: 5,
  },
  storeVisit: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 78,
  },
  tableYellow: {
    backgroundColor: '#FFC702',
  },
  tableGray: {
    backgroundColor: '#808080',
  },
  storeVisitText: {
    marginTop: 6,
  },
  storeVisitText1: {
    fontSize: 10,
  },
  storeVisitText2: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  storeVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeVisitText3: {
    fontSize: 12,
  },
});

export default StoreScreen;
