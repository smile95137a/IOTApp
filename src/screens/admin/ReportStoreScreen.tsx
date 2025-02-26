import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  fetchAllStores,
  deleteStore,
  Store,
  fetchStoresByVendorId,
} from '@/api/admin/storeApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';
import NoData from '@/component/NoData';

const ReportStoreScreen = () => {
  const route = useRoute();
  const vendorId = route.params?.vendorId;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [stores, setStores] = useState<Store[]>([]);

  const loadStores = async () => {
    try {
      dispatch(showLoading());
      const { success, data } = await fetchStoresByVendorId(vendorId);
      dispatch(hideLoading());
      if (success) {
        setStores(data);
      } else {
        setStores([]);
      }
    } catch (error) {
      dispatch(hideLoading());
      setStores([]);
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStores();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>店家管理</Text>
        </View>

        {stores.length === 0 ? (
          <NoData text="查無店家資料！" />
        ) : (
          <FlatList
            data={stores}
            keyExtractor={(item) => item.uid}
            contentContainerStyle={styles.listContainer}
            windowSize={1}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.uid}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ReportDetail', {
                    storeId: item.id,
                    vendorId,
                  })
                }
              >
                <View style={styles.row}>
                  <Image
                    source={
                      item?.imgUrl
                        ? { uri: getImageUrl(item.imgUrl) }
                        : require('@/assets/iot-user-logo.jpg')
                    }
                    style={styles.cardIcon}
                  />
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>{item.address}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
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
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    backgroundColor: '#4787C7',
    width: '48%',
    height: 128,
    aspectRatio: 1.5,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 4,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginHorizontal: '1%',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#DDD',
    marginTop: 4,
  },
});

export default ReportStoreScreen;
