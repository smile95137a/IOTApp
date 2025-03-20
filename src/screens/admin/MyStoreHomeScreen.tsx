import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MyStoreHomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-admin-bg.png')}
            resizeMode="contain" // Adjust to fit properly
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header title="我的門店" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
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
              <View style={styles.optionContent}>
                <Icon
                  name="settings"
                  size={24}
                  color="#2C3E50"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>權限設定</Text>
                <Icon name="chevron-right" size={24} color="#2C3E50" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate('AccountSettings')}
            >
              <View style={styles.optionContent}>
                <Icon
                  name="person"
                  size={24}
                  color="#2C3E50"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>帳號設定</Text>
                <Icon name="chevron-right" size={24} color="#2C3E50" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate('StoreSettings')}
            >
              <View style={styles.optionContent}>
                <Icon
                  name="store"
                  size={24}
                  color="#2C3E50"
                  style={styles.optionIcon}
                />
                <Text style={styles.optionText}>我的門市設定</Text>
                <Icon name="chevron-right" size={24} color="#2C3E50" />
              </View>
            </TouchableOpacity>
          </View>
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
  storeInfo: { alignItems: 'center', marginBottom: 30 },
  storeImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  storeName: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50' },
  options: { marginTop: 20 },
  optionButton: {
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderRadius: 10,
    marginBottom: 10,

    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    flex: 1, // 保證文字居中對齊
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default MyStoreHomeScreen;
