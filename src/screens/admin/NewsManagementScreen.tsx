import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';
import { deleteNewsById, fetchAllNews } from '@/api/admin/newsApi';
import { getImageUrl } from '@/utils/ImageUtils';

const NewsManagementScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [newsList, setNewsList] = useState([]);

  const loadNews = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllNews();
      dispatch(hideLoading());

      if (success) {
        setNewsList(data);
      } else {
        Alert.alert('錯誤', message || '無法載入最新消息');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNews();
    }, [])
  );

  const handleDelete = async (id: string) => {
    Alert.alert('刪除確認', '確定要刪除此新聞嗎？', [
      { text: '取消', style: 'cancel' },
      {
        text: '確定',
        onPress: async () => {
          try {
            dispatch(showLoading());
            await deleteNewsById(id);
            await loadNews();
          } catch (error) {
            Alert.alert('錯誤', '刪除失敗');
          } finally {
            dispatch(hideLoading());
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>最新消息管理</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddNews')}
            style={styles.addButton}
          >
            <Icon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 新聞列表 */}
        <FlatList
          data={newsList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.newsItem}>
              <View style={styles.newsInfo}>
                <Image
                  src={getImageUrl(item.imageUrl)}
                  style={styles.newsImage}
                  resizeMode="cover"
                />
                <Text style={styles.newsTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.newsContent}>
                  {item.content}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddNews', { news: item })}
                  style={styles.actionButton}
                >
                  <Icon name="pencil" size={20} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.newsUid)}
                  style={styles.actionButton}
                >
                  <Icon name="delete" size={20} color="#FF4D4D" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F8FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  newsImage: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 15,
  },
  newsItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  newsInfo: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
  },
});

export default NewsManagementScreen;
