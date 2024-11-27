import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const MyStoreHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 店鋪信息 */}
      <View style={styles.storeInfo}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.storeImage}
        />
        <Text style={styles.storeName}>板橋文化旗艦店</Text>
      </View>

      {/* 功能選項 */}
      <View style={styles.options}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('PermissionSettings')}
        >
          <Text style={styles.optionText}>權限設定</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Text style={styles.optionText}>帳號設定</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('StoreSettings')}
        >
          <Text style={styles.optionText}>我的門市設定</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  storeInfo: { alignItems: 'center', marginBottom: 30 },
  storeImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  storeName: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  options: { marginTop: 20 },
  optionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  optionText: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
});

export default MyStoreHomeScreen;
