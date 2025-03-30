import DateFormatter from '@/component/DateFormatter';
import Header from '@/component/Header';
import { getImageUrl } from '@/utils/ImageUtils';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const NewsDetailScreen = ({ route, navigation }: any) => {
  const { news } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1D1640', '#4067A4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Header
          title="最新消息"
          onBackPress={() => navigation.goBack()}
          isDarkMode
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.newsTitle}>{news.title}</Text>
          <Text style={styles.newsDate}>
            <DateFormatter date={news.createdDate} format="YYYY.MM.DD" />
          </Text>

          <Image
            src={getImageUrl(news.imageUrl)}
            style={styles.newsImage}
            resizeMode="cover"
          />

          <Text style={styles.newsContent}>{news.content}</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingBottom: 16,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00BFFF',
  },
  newsDate: {
    fontSize: 14,
    color: '#F67943',
    marginBottom: 15,
  },
  newsImage: {
    width: '100%',
    height: 230,
    borderRadius: 10,
    marginBottom: 15,
  },
  newsContent: {
    fontSize: 16,
    color: '#00BFFF',
    lineHeight: 22,
  },
});

export default NewsDetailScreen;
