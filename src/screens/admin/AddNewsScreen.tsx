import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';

const AddNewsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const news = route.params?.news || {};
  const [title, setTitle] = useState(news.title || '');
  const [content, setContent] = useState(news.content || '');

  const handleSave = async () => {
    // dispatch(showLoading());
    // try {
    //   if (news.id) {
    //     await updateNews({ id: news.id, title, content });
    //   } else {
    //     await createNews({ title, content });
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
        <Text style={styles.header}>{news.id ? '編輯新聞' : '新增新聞'}</Text>
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
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 18 },
});

export default AddNewsScreen;
