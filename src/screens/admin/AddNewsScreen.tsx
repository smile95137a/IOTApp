import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {
  updateNews,
  createNews,
  uploadNewsImages,
} from '../../api/admin/newsApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { getErrorMessage } from '../../utils/errorUtils';
import { getImageUrl } from '../../utils/ImageUtils';
import { MyDropdown } from '../../component/MyDropdown';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AddNewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();

  const [news, setNews] = useState(route.params?.news || {});
  const [title, setTitle] = useState(news.title || '');
  const [content, setContent] = useState(news.content || '');
  const [status, setStatus] = useState(news.status || 'AVAILABLE');
  const [image, setImage] = useState<any>(null);

  const handleSave = async () => {
    dispatch(showLoading());
    try {
      const newsData = { title, content, status };
      let savedNews;

      if (news.id) {
        savedNews = await updateNews(news.newsUid, {
          id: news.id,
          ...newsData,
        });
      } else {
        savedNews = await createNews(newsData);
      }

      const savedNewsId = savedNews.data?.id;
      if (image && savedNewsId) {
        await uploadNewsImages(savedNewsId, image);
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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請至設定允許存取相簿權限',
        confirmText: '我知道了',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        from: {
          tab: 'Admin',
          stack: 'NewsManagementStack',
          screen: 'AddNews',
        },
        news,
      });
    }
  };

  const handleTakePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請至設定允許存取相機權限',
        confirmText: '我知道了',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        from: {
          tab: 'Admin',
          stack: 'NewsManagementStack',
          screen: 'AddNews',
        },
        news,
      });
    }
  };

  useEffect(() => {
    if (route.params?.croppedImageUri) {
      setImage(route.params.croppedImageUri);
    }
    if (route.params?.news) {
      setNews(route.params.news);
    }
  }, [route.params]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.newsScreen}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={styles.newsScreen__scroll}>
            <View style={styles.newsScreen__background}>
              <Image
                source={require('../../assets/iot-admin-bg.png')}
                style={{ width: '100%' }}
                resizeMode="contain"
              />
            </View>

            <View style={styles.newsScreen__header}>
              <HeaderBar
                showLeftButton
                title={news.id ? '編輯最新消息' : '新增最新消息'}
              />
            </View>

            <ScrollView style={styles.newsForm}>
              <Text style={styles.newsForm__title}>
                {news.id ? '編輯最新消息' : '新增最新消息'}
              </Text>

              <View style={styles.newsForm__group}>
                <Text style={styles.newsForm__label}>標題</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.newsForm__input}
                  placeholder="請輸入標題"
                />
              </View>

              <View style={styles.newsForm__group}>
                <Text style={styles.newsForm__label}>內容</Text>
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  style={[styles.newsForm__input, { height: 120 }]}
                  multiline
                  placeholder="請輸入內容"
                />
              </View>

              <View style={styles.newsForm__group}>
                <Text style={styles.newsForm__label}>狀態</Text>
                <MyDropdown
                  value={status}
                  onChange={setStatus}
                  items={[
                    { label: '可用', value: 'AVAILABLE' },
                    { label: '不可用', value: 'UNAVAILABLE' },
                  ]}
                />
              </View>

              <View style={styles.newsForm__group}>
                <Text style={styles.newsForm__label}>上傳圖片</Text>
                <View style={styles.newsForm__uploadWrapper}>
                  {news.id ? (
                    image ? (
                      <Image
                        source={{ uri: image }}
                        style={styles.newsForm__image}
                      />
                    ) : (
                      <Image
                        src={getImageUrl(news.imageUrl)}
                        style={styles.newsForm__image}
                        resizeMode="cover"
                      />
                    )
                  ) : (
                    image && (
                      <Image
                        source={{ uri: image }}
                        style={styles.newsForm__image}
                      />
                    )
                  )}

                  <TouchableOpacity
                    style={styles.newsForm__uploadButton}
                    onPress={handleUploadPhoto}
                  >
                    <MaterialIcons name="file-upload" size={30} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.newsForm__uploadButton}
                    onPress={handleTakePhoto}
                  >
                    <MaterialIcons name="camera-alt" size={30} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.newsForm__submit}
                onPress={handleSave}
              >
                <Text style={styles.newsForm__submitText}>保存</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  newsScreen: { flex: 1 },
  newsScreen__scroll: { flex: 1 },
  newsScreen__background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  newsScreen__header: {
    backgroundColor: '#FFFFFF',
  },
  newsForm: {
    flex: 1,
    padding: 20,
  },
  newsForm__title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  newsForm__group: {
    marginBottom: 16,
  },
  newsForm__label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  newsForm__input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  newsForm__uploadWrapper: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_WIDTH - 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
    position: 'relative',
    marginBottom: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  newsForm__uploadButton: {
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
  newsForm__image: {
    position: 'absolute',
    left: 0,
    inset: 0,
    zIndex: 1,
    borderRadius: 8,
  },
  newsForm__submit: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  newsForm__submitText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddNewsScreen;
