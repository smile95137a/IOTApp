import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
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
        console.error('Error fetching news:', error);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        {banner.bannerId ? (
          <>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.image} />
              </>
            ) : (
              <>
                <Image
                  src={getImageUrl(banner.imageUrl)}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
              </>
            )}
          </>
        ) : (
          <>{image && <Image source={{ uri: image }} style={styles.image} />}</>
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>上傳圖片</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: { color: '#fff', fontSize: 18 },
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
});

export default AddBannerScreen;
