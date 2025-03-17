import { Banner, fetchAllBanners } from '@/api/bannerApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { getImageUrl } from '@/utils/ImageUtils';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useDispatch } from 'react-redux';

const bannerData = [
  {
    image: require('@/assets/iot-banner-1.png'),
  },
  {
    image: require('@/assets/iot-banner-2.jpg'),
  },
  {
    image: require('@/assets/iot-banner-3.png'),
  },
];

const ImageCarousel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width
  );
  const [banners, setBanners] = useState<Banner[]>([]);

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

  const renderBannerItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('News', {
            screen: 'NewsDetailScreen',
            params: { news: item.news },
          })
        }
        style={styles.bannerItem}
      >
        <Image src={getImageUrl(item.imageUrl)} style={styles.bannerImage} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={styles.carouselContainer}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <Carousel
        ref={carouselRef}
        data={banners}
        renderItem={renderBannerItem}
        sliderWidth={containerWidth} // Use the dynamically measured width
        itemWidth={containerWidth} // Adjust for horizontal padding
        onSnapToItem={(index) => setActiveIndex(index)}
        autoplay
        loop
        autoplayDelay={3000}
        vertical={false}
      />
      {/* Pagination */}
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
    marginBottom: 20,
  },
  bannerItem: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 180, // Fixed height for banners
    borderRadius: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0A0A30',
  },
});

export default ImageCarousel;
