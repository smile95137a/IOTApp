import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { deleteBanner, fetchAllBanners } from '@/api/admin/BannerApi';
import { getImageUrl } from '@/utils/ImageUtils';

const BannerManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [banners, setBanners] = useState([]);

  const loadBanners = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllBanners();
      dispatch(hideLoading());
      if (success) {
        setBanners(data);
      } else {
        Alert.alert('錯誤', message || '無法載入 Banner');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBanners();
    }, [])
  );

  const handleDelete = async (id: number) => {
    Alert.alert('刪除確認', '確定要刪除此 Banner 嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '確定',
        onPress: async () => {
          dispatch(showLoading());
          try {
            await deleteBanner(id);
            loadBanners();
          } catch (error) {
            Alert.alert('錯誤', '刪除失敗');
          } finally {
            dispatch(hideLoading());
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Banner 管理</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddBanner')}
            style={styles.addButton}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={banners}
          keyExtractor={(item) => item.bannerId.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.bannerItem}>
              <Image
                src={getImageUrl(item.imageUrl)}
                style={styles.bannerImage}
              />
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerText}>ID: {item.bannerId}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddBanner', { banner: item })
                  }
                  style={styles.actionButton}
                >
                  <Icon name="pencil" size={22} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.bannerId)}
                  style={styles.actionButton}
                >
                  <Icon name="delete" size={22} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
  addButton: {
    backgroundColor: '#007bff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  bannerItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bannerImage: {
    width: 120,
    height: 60,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
  bannerInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
});

export default BannerManagementScreen;
