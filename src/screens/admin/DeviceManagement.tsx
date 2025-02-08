import Header from '@/component/Header';
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // 添加箭頭圖標

const DeviceManagementScreen = ({ navigation }) => {
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
          <Header title="設備管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EnvironmentManagement')}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('@/assets/iot-d1.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>環境管理</Text>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color="#333"
              style={styles.cardArrow}
            />
          </TouchableOpacity>

          {/* 桌檯管理卡片 */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TableManagement')}
          >
            <View style={styles.cardContent}>
              <Image
                source={require('@/assets/iot-home1.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>桌檯管理</Text>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color="#333"
              style={styles.cardArrow}
            />
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

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 左右元素分布
    backgroundColor: '#FFFFFF',
    width: '100%', // 寬度更接近設計圖比例
    padding: 24,
    marginVertical: 10,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 50, // 圖標大小
    height: 50,
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  cardArrow: {
    marginLeft: 10,
  },
});

export default DeviceManagementScreen;
