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
                {news.id ? (
                  <>
                    {image ? (
                      <>
                        <Image source={{ uri: image }} style={styles.image} />
                      </>
                    ) : (
                      <>
                        <Image
                          src={getImageUrl(news.imageUrl)}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {image && (
                      <Image source={{ uri: image }} style={styles.image} />
                    )}
                  </>
                )}
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={pickImage}
                >
                  <Text style={styles.uploadButtonText}>上傳圖片</Text>
                </TouchableOpacity>
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
  saveButtonText: { color: '#fff', fontSize: 18 },
});

export default AddNewsScreen;
