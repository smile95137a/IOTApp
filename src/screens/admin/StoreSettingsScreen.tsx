import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const StoreSettingsScreen = () => {
  const [storeName, setStoreName] = useState('板橋文化旗艦店');
  const [storeAddress, setStoreAddress] =
    useState('新北市板橋區文化路一段280號B1');

  return (
    <View style={styles.container}>
      {/* 門市圖片 */}
      <View style={styles.storeImageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.storeImage}
        />
        <TouchableOpacity style={styles.cameraIcon}>
          <Text>📷</Text>
        </TouchableOpacity>
      </View>

      {/* 門市信息 */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>名稱：</Text>
          <TextInput
            style={styles.input}
            value={storeName}
            onChangeText={setStoreName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>地址：</Text>
          <TextInput
            style={styles.input}
            value={storeAddress}
            onChangeText={setStoreAddress}
          />
        </View>
      </View>

      {/* 儲存按鈕 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>儲存</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  storeImageContainer: { alignItems: 'center', marginBottom: 20 },
  storeImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
    elevation: 3,
  },
  form: { marginTop: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#FF7043',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default StoreSettingsScreen;
