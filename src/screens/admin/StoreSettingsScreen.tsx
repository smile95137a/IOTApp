import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StoreSettingsScreen = ({ navigation }) => {
  const [storeName, setStoreName] = useState('板橋文化旗艦店');
  const [storeAddress, setStoreAddress] =
    useState('新北市板橋區文化路一段280號B1');

  const editName = () => {
    // Add edit functionality here
    console.log('Edit Store Name');
  };

  const editAddress = () => {
    // Add edit functionality here
    console.log('Edit Store Address');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            resizeMode="contain"
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header title="門市設定" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {/* 門市圖片 */}
          <View style={styles.storeImageContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.storeImage}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <Icon name="camera-alt" size={20} color="#4285F4" />
            </TouchableOpacity>
          </View>

          {/* 門市信息 */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <View style={styles.row}>
                <Text style={styles.label}>名稱：</Text>
                <Text style={styles.value}>{storeName}</Text>
                <TouchableOpacity onPress={editName}>
                  <Icon name="edit" size={20} color="#4285F4" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.row}>
                <Text style={styles.label}>地址：</Text>
                <Text style={styles.value}>{storeAddress}</Text>
                <TouchableOpacity onPress={editAddress}>
                  <Icon name="edit" size={20} color="#4285F4" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 儲存按鈕 */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>儲存</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  fixedImageContainer: {
    position: 'absolute', // Fix it to the block
    right: -200,
    bottom: 0,
    zIndex: 2, // Push it behind other content
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    opacity: 0.1, // Make it subtle as a background
  },
  fixedImage: {
    width: 400,
    height: 400,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },

  storeImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  storeImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
    elevation: 3,
  },
  form: {
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#F67943',
    padding: 15,
    alignItems: 'center',
    borderRadius: 100,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StoreSettingsScreen;
