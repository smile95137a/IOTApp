import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  updateBanner,
  createBanner,
  uploadBannerImage,
} from '../../api/admin/BannerApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { hideLoading, showLoading } from '../../store/loadingSlice';
import { getErrorMessage } from '../../utils/errorUtils';
import { getImageUrl } from '../../utils/ImageUtils';
import { fetchAllNews } from '../../api/admin/newsApi';
import { MyDropdown } from '../../component/MyDropdown';

const AddBannerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();

  const [banner, setBanner] = useState(route.params?.banner || {});
  const [status, setStatus] = useState(banner.status || 'AVAILABLE');
  const [newsId, setNewsId] = useState(banner?.news?.id || '');
  const [image, setImage] = useState(null);
  const [newsList, setNewsList] = useState<any[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchAllNews();
        setNewsList(response.data || []);
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };
    loadNews();
  }, []);

  const handleSave = async () => {
    if (!newsId) {
      await openInfoDialog({
        title: '錯誤',
        content: '請選擇要連結的最新消息',
        confirmText: '我知道了',
      });
      return;
    }

    if (!status) {
      await openInfoDialog({
        title: '錯誤',
        content: '請選擇狀態',
        confirmText: '我知道了',
      });
      return;
    }

    if (!image && !banner?.imageUrl) {
      await openInfoDialog({
        title: '錯誤',
        content: '請上傳圖片',
        confirmText: '我知道了',
      });
      return;
    }

    dispatch(showLoading());
    try {
      const bannerData = { status, newsId };
      let savedBanner;

      if (banner.bannerId) {
        savedBanner = await updateBanner(banner.bannerId, {
          bannerId: banner.bannerId,
          ...bannerData,
        });
      } else {
        savedBanner = await createBanner(bannerData);
      }

      if (image && savedBanner?.data?.bannerId) {
        await uploadBannerImage(savedBanner?.data?.bannerId, image);
      }

      dispatch(hideLoading());
      (navigation as any).goBack();
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        aspectRatio: [16, 9],
        from: {
          tab: 'Admin',
          stack: 'BannerManagementStack',
          screen: 'AddBanner',
        },
        banner,
      });
    }
  };

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
        aspectRatio: [16, 9],
        from: {
          tab: 'Admin',
          stack: 'BannerManagementStack',
          screen: 'AddBanner',
        },
        banner,
      });
    }
  };

  useEffect(() => {
    if (route.params?.croppedImageUri) {
      setImage(route.params.croppedImageUri);
    }
    if (route.params?.banner) {
      setBanner(route.params.banner);
    }
  }, [route.params]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.bannerScreen}>
        <View style={styles.bannerScreen__scroll}>
          <View style={styles.bannerScreen__background}>
            <Image
              source={require('../../assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bannerScreen__header}>
            <HeaderBar
              showLeftButton
              title={banner.bannerId ? '編輯Banner' : '新增Banner'}
            />
          </View>

          <ScrollView style={styles.bannerForm}>
            <Text style={styles.bannerForm__title}>
              {banner.bannerId ? '編輯Banner' : '新增Banner'}
            </Text>

            <View style={styles.bannerForm__group}>
              <Text style={styles.bannerForm__label}>連結的最新消息</Text>
              <MyDropdown
                value={String(newsId)}
                onChange={setNewsId}
                items={newsList.map((news) => ({
                  label: news.title,
                  value: String(news.id),
                }))}
                zIndex={3000}
              />
            </View>

            <View style={styles.bannerForm__group}>
              <Text style={styles.bannerForm__label}>狀態</Text>
              <MyDropdown
                value={status}
                onChange={setStatus}
                items={[
                  { label: '啟用', value: 'AVAILABLE' },
                  { label: '停用', value: 'UNAVAILABLE' },
                ]}
                zIndex={2000}
              />
            </View>

            <View style={styles.bannerForm__group}>
              <Text style={styles.bannerForm__label}>上傳圖片</Text>
              <View style={styles.bannerForm__uploadWrapper}>
                {banner.bannerId ? (
                  image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.bannerForm__image}
                    />
                  ) : (
                    <Image
                      src={getImageUrl(banner.imageUrl)}
                      style={styles.bannerForm__image}
                      resizeMode="cover"
                    />
                  )
                ) : (
                  image && (
                    <Image
                      source={{ uri: image }}
                      style={styles.bannerForm__image}
                    />
                  )
                )}

                <TouchableOpacity
                  style={styles.bannerForm__uploadButton}
                  onPress={handleUploadPhoto}
                >
                  <MaterialIcons name="file-upload" size={30} color="#666666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bannerForm__uploadButton}
                  onPress={handleTakePhoto}
                >
                  <MaterialIcons name="camera-alt" size={30} color="#666666" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.bannerForm__submit}
              onPress={handleSave}
            >
              <Text style={styles.bannerForm__submitText}>保存</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  bannerScreen: { flex: 1 },
  bannerScreen__scroll: { flex: 1 },
  bannerScreen__background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  bannerScreen__header: {
    backgroundColor: '#FFFFFF',
  },
  bannerForm: {
    flex: 1,
    padding: 20,
  },
  bannerForm__title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bannerForm__group: {
    marginBottom: 12,
  },
  bannerForm__label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  bannerForm__uploadWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
    height: 200,
    position: 'relative',
    marginBottom: 12,
  },
  bannerForm__uploadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 2,
  },
  bannerForm__image: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    borderRadius: 8,
  },
  bannerForm__submit: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bannerForm__submitText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddBannerScreen;
