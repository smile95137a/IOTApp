import Header from '@/component/Header';
import ImageCarousel from '@/component/ImageCarousel';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const bannerData = [
  {
    image: 'https://via.placeholder.com/400x200.png?text=歡慶開館', // Replace with real image URL
  },
];

const storeData = [
  {
    id: 1,
    name: '板橋文化旗艦店',
    address: '新北市板橋區文化路一段280號B1',
    distance: '500m',
    visitCount: 5,
  },
  {
    id: 2,
    name: '台北賽慶店',
    address: '台北市中正區羅斯福路一段1號2F',
    distance: '1.2 km',
    visitCount: 2,
  },
  {
    id: 3,
    name: '台北西門店',
    address: '台北市萬華區華西街135號11F',
    distance: '1.8 km',
    visitCount: 1,
  },
];

const StoreScreen = ({ navigation }: any) => {
  const renderBanner = ({ item }: any) => {
    return <Image source={{ uri: item.image }} style={styles.bannerImage} />;
  };

  const renderStoreItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.storeItem}
        onPress={() =>
          navigation.navigate('StoreDetailScreen', { store: item })
        }
      >
        <View style={styles.storeImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder image
            style={styles.storeImage}
          />
        </View>
        <View style={styles.storeDetails}>
          <Text style={styles.storeName}>{item.name}</Text>
          <Text style={styles.storeAddress}>{item.address}</Text>
          <Text style={styles.storeDistance}>{item.distance}</Text>
        </View>
        <View style={styles.storeVisit}>
          <Text style={[styles.storeVisitText, styles.storeVisitText1]}>
            查看
          </Text>
          <Text style={[styles.storeVisitText, styles.storeVisitText2]}>
            {item.visitCount}
          </Text>
          <View style={styles.storeVisitContainer}>
            <Text style={[styles.storeVisitText, styles.storeVisitText3]}>
              查看
            </Text>
            <Icon name="chevron-right" size={20} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="門市探索" />
        <ImageCarousel />

        <FlatList
          windowSize={10}
          data={storeData}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.storeList}
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
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  storeList: {
    paddingHorizontal: 10,
  },
  storeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    height: 106,
    overflow: 'hidden',
  },
  storeImageContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeImage: {
    width: 74,
    height: 74,
    borderRadius: 200,
  },
  storeDetails: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
  },
  storeDistance: {
    fontSize: 12,
    color: '#F67943',
    marginTop: 5,
  },
  storeVisit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F67943',
    minWidth: 106,
  },
  storeVisitText: {
    color: '#ffffff',
  },
  storeVisitText1: {
    fontSize: 10,
  },
  storeVisitText2: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  storeVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeVisitText3: {
    fontSize: 12,
  },
  visitCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  visitText: {
    fontSize: 14,
    color: '#ff5722',
  },
});

export default StoreScreen;
