import DateFormatter from '@/component/DateFormatter';
import Header from '@/component/Header';
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
  const imageUrl = !!news.image
    ? { uri: news.image }
    : require('@/assets/iot-news.png');
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="最新消息"
        onBackPress={() => navigation.goBack()}
        rightIcon="more-vert"
        onRightPress={() => console.log('More options pressed')}
      />
      <ScrollView style={styles.detail}>
        <Text style={styles.newsTitle}>{news.title}</Text>
        <Text style={styles.newsDate}>
          <DateFormatter date={news.createdDate} format="YYYY.MM.DD" />
        </Text>

        <Image source={imageUrl} style={styles.newsImage} resizeMode="cover" />

        <Text style={styles.newsContent}>{news.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  detail: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    margin: 10,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    color: '#333',
    lineHeight: 22,
  },
});

export default NewsDetailScreen;
