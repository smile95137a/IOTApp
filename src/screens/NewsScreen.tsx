import { News, fetchNewsByStatusNoUser } from '@/api/newsApi';
import DateFormatter from '@/component/DateFormatter';
import Header from '@/component/Header';
import ImageCarousel from '@/component/ImageCarousel';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { getImageUrl } from '@/utils/ImageUtils';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

const NewsScreen = ({ navigation }: any) => {
  const [newsData, setNewsData] = useState<News[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadNews = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchNewsByStatusNoUser(
          'AVAILABLE'
        );
        dispatch(hideLoading());
        if (success) {
          setNewsData(data);
        } else {
          Alert.alert('錯誤', message || '無法載入店家資訊');
        }
      } catch (error) {
        dispatch(hideLoading());
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        Alert.alert('錯誤', errorMessage);
      }
    };
    loadNews();
  }, []);

  return (
    <LinearGradient
      colors={['#1D1640', '#4067A4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="最新消息" isDarkMode />
          <ImageCarousel />
          <ScrollView>
            {newsData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.newsItem}
                onPress={() =>
                  navigation.navigate('NewsDetailScreen', { news: item })
                }
              >
                <Image
                  source={{ uri: getImageUrl(item.imageUrl) }}
                  style={styles.newsImage}
                />
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  <Text style={styles.newsDescription} numberOfLines={2}>
                    {item.content}
                  </Text>
                  <Text style={styles.newsDate}>
                    <DateFormatter
                      date={item.createdDate}
                      format="YYYY.MM.DD"
                    />
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#000" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#00BFFF',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: 'center',
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  newsDescription: {
    fontSize: 12,
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
  },
});

export default NewsScreen;
