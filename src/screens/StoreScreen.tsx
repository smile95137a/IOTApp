import { fetchAllStores } from '@/api/storeApi';
import Header from '@/component/Header';
import ImageCarousel from '@/component/ImageCarousel';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { genRandom, genRandomNumbers } from '@/utils/RandomUtils';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import * as Location from 'expo-location';
import { findNearestStores } from '@/utils/LocationUtils';
import { getImageUrl } from '@/utils/ImageUtils';

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
      Alert.alert('錯誤', '未授予 GPS 權限');
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
        Alert.alert('錯誤', message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert('錯誤', errorMessage);
    }
  };

  useEffect(() => {
    if (stores.length > 0) {
      const latitude = locationData.latitude || 0;
      const longitude = locationData.longitude || 0;
      const nearest = findNearestStores(latitude, longitude, stores);
      setNearStores(nearest);
    }
  }, [locationData, stores]);

  const renderStoreItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.storeItem}
        onPress={() => navigation.navigate('StoreDetail', { store: item })}
      >
        <View style={styles.storeImageContainer}>
          <Image src={getImageUrl(item?.imgUrl)} style={styles.storeImage} />
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
        <View style={styles.storeVisit}>
          <Text style={[styles.storeVisitText, styles.storeVisitText1]}>
            剩餘桌數
          </Text>
          <Text style={[styles.storeVisitText, styles.storeVisitText2]}>
            {item.availablesCount}
          </Text>
          <View style={styles.storeVisitContainer}>
            <Text style={[styles.storeVisitText, styles.storeVisitText3]}>
              查看
            </Text>
            <Text style={[styles.storeVisitText, styles.storeVisitText4]}>
              <Icon name="chevron-right" size={18} color="#fff" />
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="門市探索" />
        <ImageCarousel />
        <FlatList
          windowSize={1}
          data={nearStores}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.storeList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },

  carouselContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  storeList: {},
  storeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    height: 106,
    overflow: 'hidden',
  },
  storeImageContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeImage: {
    width: 74,
    height: 74,
    borderRadius: 200,
  },
  storeDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
  },
  storeDistance: {
    fontSize: 12,
    color: '#F67943',
    marginTop: 5,
  },
  storeVisit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F67943',
    minWidth: 78,
  },
  storeVisitText: {
    color: '#ffffff',
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
  storeVisitText4: {},
  visitCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  visitText: {
    fontSize: 14,
    color: '#ff5722',
  },
});

export default StoreScreen;
