// components/LoadingMask.tsx
import { RootState } from '@/store/store';
import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const LoadingMask: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  return (
    <Modal visible={isLoading} transparent animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingMask;
