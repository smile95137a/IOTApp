import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const LoadingMask: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  if (!isLoading) return null; // 不顯示時不渲染，避免影響 UI

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // 半透明背景
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000, // 確保它在最上層
    elevation: 10000, // 提高 Android 層級
  },
  loaderContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingMask;
