import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { getMonitorsByStoreId } from '@/api/admin/monitorApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import HeaderBar from '@/component/admin/HeaderBar';

const MonitorViewDetailScreen = () => {
  const route = useRoute();
  const storeId = route.params?.storeId;
  const dispatch = useDispatch<AppDispatch>();
  const [monitors, setMonitors] = useState([]);

  const loadMonitors = async () => {
    try {
      dispatch(showLoading());
      const response = await getMonitorsByStoreId(storeId);
      dispatch(hideLoading());

      if (response.success) {
        const formattedData = response.data.map((item) => ({
          ...item,
          id: item.id,
          name: item.name,
          status: !!item.status,
        }));

        setMonitors(formattedData);
      } else {
        Alert.alert('錯誤', '無法獲取監視器列表');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '獲取監視器失敗');
    }
  };

  useEffect(() => {
    loadMonitors();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMonitors();
    }, [])
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar title="攝影機管理" />
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>攝影店家</Text>
            </View>

            {/* ScrollView 改寫 Grid */}
            <ScrollView contentContainerStyle={styles.listContainer}>
              <View style={styles.cardWrapper}>
                {monitors.map((item) => (
                  <TouchableOpacity key={item.uid} style={styles.card}>
                    <View style={styles.row}>
                      <Image
                        source={require('@/assets/iot-camera-logo.png')}
                        style={styles.cardIcon}
                      />
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                      </View>
                    </View>
                    <Image
                      source={require('@/assets/iot-m.jpg')}
                      style={styles.cameraImage}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  headerWrapper: { backgroundColor: '#FFFFFF' },
  contentWrapper: { flex: 1, padding: 20 },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 999,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    backgroundColor: '#4787C7',
    width: '48%',
    height: 200,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cameraImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
});

export default MonitorViewDetailScreen;
