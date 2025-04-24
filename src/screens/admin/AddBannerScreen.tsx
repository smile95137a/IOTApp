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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { fetchAllNews, uploadNewsImages } from '@/api/admin/newsApi';
import {
  createBanner,
  updateBanner,
  uploadBannerImage,
} from '@/api/admin/BannerApi';
import { ScrollView } from 'react-native-gesture-handler';
import { getImageUrl } from '@/utils/ImageUtils';
import HeaderBar from '@/component/admin/HeaderBar';
import { logJson } from '@/utils/logJsonUtils';
import { useDialog } from '@/context/DialogContext';
import { getErrorMessage } from '@/utils/errorUtils';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
      const bannerData = {
        status,
        newsId,
      };

      let savedBanner;
      console.log(banner.bannerId);

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
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar
              showLeftButton
              title={banner.bannerId ? '編輯Banner' : '新增Banner'}
            />
          </View>
          <View style={styles.contentWrapper}>
            <ScrollView style={styles.container}>
              <Text style={styles.header}>
                {banner.bannerId ? '編輯Banner' : '新增Banner'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(newsId)}
                    onValueChange={(itemValue) => setNewsId(itemValue)}
                    items={newsList.map((news) => ({
                      label: news.title,
                      value: String(news.id),
                      key: news.id,
                    }))}
                    placeholder={{ label: '選擇連結最新消息', value: '' }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    Icon={() => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color="#888"
                      />
                    )}
                  />
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    items={[
                      { label: '啟用', value: 'AVAILABLE' },
                      { label: '停用', value: 'UNAVAILABLE' },
                    ]}
                    placeholder={{ label: '請選擇狀態', value: '' }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    Icon={() => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color="#888"
                      />
                    )}
                  />
                </View>
              </View>
              <View style={styles.uploadContainer}>
                <Text style={styles.inputLabel}>上傳照片</Text>
                <View style={styles.uploadWrapper}>
                  {banner.bannerId ? (
                    <>
                      {image ? (
                        <>
                          <Image
                            source={{ uri: image }}
                            style={styles.profileImage}
                          />
                        </>
                      ) : (
                        <>
                          <Image
                            src={getImageUrl(banner.imageUrl)}
                            style={styles.profileImage}
                            resizeMode="cover"
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {image && (
                        <Image
                          source={{ uri: image }}
                          style={styles.profileImage}
                        />
                      )}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUploadPhoto}
                  >
                    <MaterialIcons
                      name="file-upload"
                      size={30}
                      color="#666666"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleTakePhoto}
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={30}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </ScrollView>
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
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newsImage: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 15,
  },
  saveButtonText: { color: '#fff', fontSize: 18 },
  uploadContainer: {
    marginTop: 20,
  },
  uploadWrapper: {
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
  uploadButton: {
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
  profileImage: {
    position: 'absolute', // 讓圖片絕對定位在父容器內
    left: 0,
    inset: 0,
    zIndex: 1, // 確保圖片在最上層
  },
  inputLabel: {
    fontSize: 22,
    marginBottom: 5,
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
});

export default AddBannerScreen;
