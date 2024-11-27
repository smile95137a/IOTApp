import Header from '@/component/Header';
import ImageCarousel from '@/component/ImageCarousel';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const newsData = [
  {
    id: 1,
    title: '板橋文化旗艦店開館大放送',
    date: '2024.9.16',
    content:
      '內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容',
    image: 'https://via.placeholder.com/400x200.png?text=News+Image',
  },
  {
    id: 2,
    title: '最新活動：會員專屬折扣',
    date: '2024.9.10',
    content:
      '內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容內容',
    image: 'https://via.placeholder.com/400x200.png?text=News+Image',
  },
  {
    id: 3,
    title: "Well help walk somebody learn institution ten.",
    date: "2024.01.28",
    content:
      "Require law dream similar whom environmental free. Child time voice or interest. Point section station play. Accept letter section sing scientist.",
    image: "https://via.placeholder.com/400x200.png?text=News+Image+3",
  },
  {
    id: 4,
    title: "Cut yourself western.",
    date: "2024.09.02",
    content:
      "Wish expert rather safe religious become road. Throughout southern deep agency allow realize market fly. Senior ready anyone dog professional physical.",
    image: "https://via.placeholder.com/400x200.png?text=News+Image+4",
  },
  {
    id: 5,
    title: "Hot relate picture position also.",
    date: "2024.01.27",
    content:
      "Message establish hundred similar know where. Than we or develop price what international better. Language and expect major allow.",
    image: "https://via.placeholder.com/400x200.png?text=News+Image+5",
  },
  {
    id: 6,
    title: "Camera bit east.",
    date: "2024.11.06",
    content:
      "Thing toward mouth. Stock enjoy can paper fall. A my follow together. Fight short similar she.",
    image: "https://via.placeholder.com/400x200.png?text=News+Image+6",
  },
];

const NewsScreen = ({ navigation }: any) => {
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => navigation.navigate('NewsDetailScreen', { news: item })}
    >
      <Image
        source={require('@/assets/iot-news.png')}
        style={styles.newsImage}
      />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <Text style={styles.newsDescription} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.newsDate}>{item.date}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#A6A6A6" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <Header title="最新消息" />
      <ImageCarousel />
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 16, // Padding for the entire container
    backgroundColor: '#f8f8f8',
  },
  newsItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    color: '#666',
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: '#F67943',
  },
});

export default NewsScreen;
