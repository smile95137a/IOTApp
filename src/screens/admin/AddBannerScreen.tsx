import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { Picker } from '@react-native-picker/picker';
import { fetchAllNews, uploadNewsImages } from '@/api/admin/newsApi';
import {
  createBanner,
  updateBanner,
  uploadBannerImage,
} from '@/api/admin/BannerApi';
import { ScrollView } from 'react-native-gesture-handler';
import { getImageUrl } from '@/utils/ImageUtils';
import HeaderBar from '@/component/admin/HeaderBar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const AddBannerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const banner = route.params?.banner || {};

  const [status, setStatus] = useState(banner.status || 'AVAILABLE');
  const [newsId, setNewsId] = useState(banner?.news?.id || '');
  const [image, setImage] = useState(null);
  const [newsList, setNewsList] = useState([]);
  console.log(banner);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchAllNews();
        setNewsList(response.data || []);
      } catch (error) {
        console.log('Error fetching news:', error);
      }
    };
    loadNews();
  }, []);

  const handleSave = async () => {
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

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Alert.alert('錯誤', '操作失敗');
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相簿權限');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相機權限');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

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
            <HeaderBar title={banner.bannerId ? '編輯Banner' : '新增Banner'} />
          </View>
          <View style={styles.contentWrapper}>
            <ScrollView style={styles.container}>
              <Text style={styles.header}>
                {banner.bannerId ? '編輯Banner' : '新增Banner'}
              </Text>
              <Picker
                selectedValue={String(newsId)}
                onValueChange={(itemValue) => setNewsId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="選擇連結最新消息" value="" />
                {newsList.map((news) => (
                  <Picker.Item
                    key={news.id}
                    label={news.title}
                    value={String(news.id)}
                  /> // 轉成字串
                ))}
              </Picker>

              <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="啟用" value="AVAILABLE" />
                <Picker.Item label="停用" value="UNAVAILABLE" />
              </Picker>

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
});

export default AddBannerScreen;
