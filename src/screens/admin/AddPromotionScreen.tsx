import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const AddPromotionScreen = ({ route, navigation }) => {
  const [promotionName, setPromotionName] = useState('');
  const [promotionAmount, setPromotionAmount] = useState('');
  const [actualCharge, setActualCharge] = useState('');
  const [imageUri, setImageUri] = useState(null); // 儲存上傳圖片的路徑

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        Alert.alert('取消', '您已取消選擇圖片');
      } else if (response.errorMessage) {
        Alert.alert('錯誤', response.errorMessage);
      } else {
        const uri = response.assets[0]?.uri;
        setImageUri(uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            resizeMode="contain" // Adjust to fit properly
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header
            title="優惠方案設置"
            onBackPress={() => navigation.goBack()}
          />
        </View>
        <View style={styles.mainContainer}>
          {/* Image Upload Section */}
          <View style={styles.imageSection}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <TouchableOpacity
                style={styles.imagePlaceholder}
                onPress={handleSelectImage}
              >
                <Text style={styles.placeholderText}>點擊上傳圖片</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSelectImage}
              style={styles.cameraIcon}
            >
              <Icon name="photo-camera" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>名稱：</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入優惠名稱"
                value={promotionName}
                onChangeText={setPromotionName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>儲值額度：</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入儲值金額"
                value={promotionAmount}
                onChangeText={setPromotionAmount}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>實收費用：</Text>
              <TextInput
                style={styles.input}
                placeholder="輸入實收金額"
                value={actualCharge}
                onChangeText={setActualCharge}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Save Button */}
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
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#AAA',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    right: '30%',
    backgroundColor: '#FF7043',
    padding: 10,
    borderRadius: 20,
  },
  form: {},
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 5,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    color: '#616161',
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  saveButton: {
    backgroundColor: '#F67943',
    paddingVertical: 15,
    borderRadius: 100,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddPromotionScreen;
