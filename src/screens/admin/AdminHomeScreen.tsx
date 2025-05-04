// src/screens/admin/AdminHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AdminHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/iot-logo-black.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>歡迎來到管理後台</Text>
      <Text style={styles.subtitle}>請從左側選單選擇功能開始操作</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminHomeScreen;
