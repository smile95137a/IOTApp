import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { createNews, updateNews, uploadNewsImages } from '@/api/admin/newsApi';
import { Picker } from '@react-native-picker/picker';
import { getImageUrl } from '@/utils/ImageUtils';
import HeaderBar from '@/component/admin/HeaderBar';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const AddNewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const news = route.params?.news || {};

  const [title, setTitle] = useState(news.title || '');
  const [content, setContent] = useState(news.content || '');
  const [status, setStatus] = useState(news.status || 'AVAILABLE');
  const [image, setImage] = useState<any>(null);

  const handleSave = async () => {
    dispatch(showLoading());
    try {
      const newsData = {
        title,
        content,
        status,
      };

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

      navigation.goBack();
    } catch (error) {
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
            <HeaderBar title={news.id ? '編輯最新消息' : '新增最新消息'} />
          </View>
          <View style={styles.contentWrapper}>
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.container}>
                <Text style={styles.header}>
                  {news.id ? '編輯最新消息' : '新增最新消息'}
                </Text>
                <TextInput
                  placeholder="標題"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />
                <TextInput
                  placeholder="內容"
                  value={content}
                  onChangeText={setContent}
                  style={styles.input}
                  multiline
                />
                <Picker
                  selectedValue={status}
                  onValueChange={(itemValue) => setStatus(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="可用" value="AVAILABLE" />
                  <Picker.Item label="不可用" value="UNAVAILABLE" />
                </Picker>

                <View style={styles.uploadContainer}>
                  <Text style={styles.inputLabel}>上傳照片</Text>
                  <View style={styles.uploadWrapper}>
                    {news.id ? (
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
                              src={getImageUrl(news.imageUrl)}
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
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
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
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
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

export default AddNewsScreen;
