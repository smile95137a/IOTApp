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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';

const AddBannerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const banner = route.params?.banner || {};
  const [title, setTitle] = useState(banner.title || '');
  const [imageUrl, setImageUrl] = useState(banner.imageUrl || '');

  const handleSave = async () => {
    // dispatch(showLoading());
    // try {
    //   if (banner.id) {
    //     await updateBanner({ id: banner.id, title, imageUrl });
    //   } else {
    //     await createBanner({ title, imageUrl });
    //   }
    //   navigation.goBack();
    // } catch (error) {
    //   Alert.alert('錯誤', '操作失敗');
    // } finally {
    //   dispatch(hideLoading());
    // }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>
          {banner.id ? '編輯 Banner' : '新增 Banner'}
        </Text>

        <TextInput
          placeholder="標題"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="圖片 URL"
          value={imageUrl}
          onChangeText={setImageUrl}
          style={styles.input}
        />
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.bannerPreview} />
        ) : null}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  bannerPreview: {
    width: '100%',
    height: 150,
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

export default AddBannerScreen;
