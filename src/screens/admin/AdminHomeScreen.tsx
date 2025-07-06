// src/screens/admin/AdminHomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import SharedScreenLayout from '../../navigators/SharedScreenLayout';

const AdminHomeScreen = ({ navigation }) => {
  return (
    <SharedScreenLayout navigation={navigation} title="首頁">
      <View style={styles.adminHome}>
        <Image
          source={require('../../assets/i-Pool_logo_RGB_1.png')}
          style={styles.adminHome__logo}
          resizeMode="contain"
        />
        <Text style={styles.adminHome__title}>歡迎來到管理後台</Text>
        <Text style={styles.adminHome__subtitle}>
          請從左側選單選擇功能開始操作
        </Text>
      </View>
    </SharedScreenLayout>
  );
};

const styles = StyleSheet.create({
  adminHome: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  adminHome__logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  adminHome__title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  adminHome__subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default AdminHomeScreen;
