import React, { useRef, useState } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const banners = [
  {
    image: require('@/assets/iot-banner.png'), // Replace with actual image paths
  },
  {
    image: require('@/assets/iot-banner.png'), // Replace with actual image paths
  },
];

const ImageCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width
  );

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerItem}>
      <Image source={item.image} style={styles.bannerImage} />
    </View>
  );

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
    backgroundColor: '#4CAF50',
  },
});

export default ImageCarousel;
