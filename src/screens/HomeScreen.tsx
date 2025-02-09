import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ImageCarousel from '@/component/ImageCarousel';
import Header from '@/component/Header';
import * as Location from 'expo-location';
import { findNearestStores } from '@/utils/LocationUtils';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { fetchAllStores } from '@/api/storeApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { decryptData, encryptData } from '@/utils/cryptoUtils';
import { openCamera } from '@/store/cameraSlice';

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
      Alert.alert('錯誤', '未授予 GPS 權限');
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
      <View style={styles.container}>
        <Header />
        {/* Banner Section */}
        <ImageCarousel />

        {/* Cards Section */}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.row}>
            {/* Store Exploration Section */}
            <TouchableOpacity style={[styles.card, styles.greenCard]}>
              <View style={styles.cardRow}>
                {/* 左側圖像 */}
                <Image
                  source={require('@/assets/iot-home-3.png')}
                  style={styles.leftImage}
                />

                {/* 右側文字與按鈕 */}
                <View style={styles.rightContent}>
                  <View style={styles.textContent}>
                    <Text style={styles.cardSubtitle}>最近分店：</Text>
                    {nearStores.length > 0 ? (
                      nearStores.map((store, index) => (
                        <Text key={index} style={styles.cardText}>
                          {store.name} {store.distance.toFixed(1)} km
                        </Text>
                      ))
                    ) : (
                      <Text style={styles.cardText}>無法獲取最近的店家</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.cardButton}
                    onPress={() => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Explore' }],
                      });
                    }}
                  >
                    <Text style={styles.cardButtonText}>門店探索</Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color="#000"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={[styles.row, styles.rowGap]}>
            {/* QR Scanner Section */}
            <TouchableOpacity
              style={[styles.card, styles.orangeCard]}
              onPress={() => navigation.navigate('QRScannerScreen')}
            >
              <View style={[styles.cardContentCentered]}>
                <Image
                  source={require('@/assets/iot-home-2.png')}
                  style={styles.cardImage}
                />
                <Text style={[styles.cardSubtitle, styles.centerClass]}>
                  掃描球桌上的QRcode開台/關台
                </Text>
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => dispatch(openCamera())}
              >
                <Text style={styles.cardButtonText}>掃碼開台</Text>
                <MaterialIcons name="chevron-right" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Reservation Section */}
            <TouchableOpacity style={[styles.card, styles.blueCard]}>
              <View style={[styles.cardContentCentered]}>
                <Image
                  source={require('@/assets/iot-home-1.png')}
                  style={styles.cardImage}
                />
                <Text style={styles.cardSubtitle}>選擇門店預訂開台</Text>
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Explore' }],
                  });
                }}
              >
                <Text style={styles.cardButtonText}>預定開台</Text>
                <MaterialIcons name="chevron-right" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  content: {
    paddingBottom: 20,
  },
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
