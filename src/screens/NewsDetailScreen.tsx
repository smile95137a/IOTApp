import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NewsDetailScreen = ({ route, navigation }: any) => {
  const { news } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="最新消息"
        onBackPress={() => navigation.goBack()}
        rightIcon="more-vert"
        onRightPress={() => console.log('More options pressed')}
      />

      <View style={styles.detail}>
        <Text style={styles.newsTitle}>{news.title}</Text>
        <Text style={styles.newsDate}>{news.date}</Text>
        <Image source={{ uri: news.image }} style={styles.newsImage} />
        <Text style={styles.newsContent}>{news.content}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    flex: 1,
    padding: 15, // 添加 padding 内边距
    borderRadius: 10, // 可选：圆角处理
    margin: 10, // 外边距使内容与屏幕边缘有距离
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    height: 200,
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
