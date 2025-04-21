import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { Menu, Provider } from 'react-native-paper';
import Header from '@/component/Header';
import { deleteBanner, fetchAllBanners } from '@/api/admin/BannerApi';
import { getImageUrl } from '@/utils/ImageUtils';
import HeaderBar from '@/component/admin/HeaderBar';
import { useDialog } from '@/context/DialogContext';

const BannerManagementScreen = () => {
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);
  const { openInfoDialog, openConfirmDialog } = useDialog();

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
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入 Banner',
          confirmText: '我知道了',
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: '發生錯誤，請稍後再試',
        confirmText: '我知道了',
      });
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
    const confirmed = await openConfirmDialog({
      title: '刪除確認',
      content: '確定要刪除此 Banner 嗎？',
      confirmText: '刪除',
      cancelText: '取消',
    });
    if (!confirmed) return;

    dispatch(showLoading());
    try {
      await deleteBanner(id);
      await loadBanners();
    } catch (error) {
      await openInfoDialog({
        title: '錯誤',
        content: '刪除失敗',
        confirmText: '我知道了',
      });
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Provider>
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
            <HeaderBar title="Banner 管理" />
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.gridWrapper}>
                {banners.map((item) => (
                  <TouchableOpacity
                    key={item.bannerId}
                    style={styles.cardWrapper}
                    onPress={() =>
                      navigation.navigate('AddBanner', { banner: item })
                    }
                  >
                    <Image
                      src={getImageUrl(item.imageUrl)}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardTitle}>ID: {item.bannerId}</Text>
                      <View style={styles.cardActions}>
                        <Menu
                          visible={visibleMenuId === item.bannerId}
                          onDismiss={() => setVisibleMenuId(null)}
                          anchor={
                            <TouchableOpacity
                              style={styles.iconButton}
                              onPress={() =>
                                setVisibleMenuId(
                                  visibleMenuId === item.bannerId
                                    ? null
                                    : item.bannerId
                                )
                              }
                            >
                              <Icon
                                name="dots-vertical"
                                size={20}
                                color="#FFF"
                              />
                            </TouchableOpacity>
                          }
                          contentStyle={styles.menuStyle}
                        >
                          <Menu.Item
                            onPress={() =>
                              navigation.navigate('AddBanner', { banner: item })
                            }
                            title="編輯"
                            leadingIcon="pencil-outline"
                          />
                        </Menu>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.addCardWrapper}
                  onPress={() => navigation.navigate('AddBanner')}
                >
                  <Image
                    source={require('@/assets/iot-logo-white.png')}
                    style={styles.cardImage}
                  />
                  <View style={styles.addCardFooter}>
                    <Text style={styles.addCardText}>新增Banner</Text>
                    <View style={styles.addIconWrapper}>
                      <Icon name="plus" size={20} color="#FFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Provider>
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
  scrollContent: { paddingBottom: 20 },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    width: '48%',
    height: 128,
    borderRadius: 20,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: '1%',
  },
  cardImage: { width: '100%', height: '100%', flex: 1, resizeMode: 'contain' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardActions: { flexDirection: 'row', alignItems: 'center' },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardWrapper: {
    backgroundColor: '#FFC702',
    width: '48%',
    height: 128,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
  },
  addCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  addCardText: { fontSize: 16, fontWeight: 'bold' },
  addIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuStyle: { backgroundColor: '#FFF', borderRadius: 10 },
});

export default BannerManagementScreen;
