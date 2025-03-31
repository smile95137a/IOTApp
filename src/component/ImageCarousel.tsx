import { Banner, fetchAllBanners } from '@/api/bannerApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { getImageUrl } from '@/utils/ImageUtils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useDispatch } from 'react-redux';

const ImageCarousel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const horizontalPadding = 16;
  const carouselWidth = screenWidth - horizontalPadding * 2;

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const { success, data, message } = await fetchAllBanners();
        if (success) {
          setBanners(data);
        } else {
          Alert.alert('錯誤', message || '無法載入資訊');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Alert.alert('錯誤', errorMessage);
      }
    };
    loadBanners();
  }, []);

  const renderBannerItem = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate('News', {
          screen: 'NewsDetailScreen',
          params: { news: item.news },
        })
      }
      style={[styles.bannerItem, { width: carouselWidth }]}
    >
      <Image
        src={getImageUrl(item.imageUrl)}
        style={[styles.bannerImage, { width: carouselWidth }]}
      />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.carouselContainer,
        { paddingHorizontal: horizontalPadding },
      ]}
    >
      <Carousel
        width={carouselWidth}
        height={180}
        data={banners}
        loop
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={800}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={renderBannerItem}
      />

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  bannerItem: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    height: 165,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4067A4',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFC702',
  },
});

export default ImageCarousel;
