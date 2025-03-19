import Header from '@/component/Header';
import { useRoute } from '@react-navigation/native';
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
  const route = useRoute();
  const storeId = route.params?.storeId;

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
          <Header title="設備管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('EnvironmentManagement', { storeId })
            }
          >
            <View style={styles.cardContent}>
              <Image
                source={require('@/assets/iot-switch.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>環境管理</Text>
            </View>
            <View style={styles.cardBtn}>
              <Icon name="chevron-right" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* 桌檯管理卡片 */}
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('DeviceTableManagement', { storeId })
            }
          >
            <View style={styles.cardContent}>
              <Image
                source={require('@/assets/iot-table-enable.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>桌檯管理</Text>
            </View>
            <View style={styles.cardBtn}>
              <Icon name="chevron-right" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('MonitorManagement', { storeId })
            }
          >
            <View style={styles.cardContent}>
              <Image
                source={require('@/assets/iot-switch.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardText}>攝影機管理</Text>
            </View>
            <View style={styles.cardBtn}>
              <Icon name="chevron-right" size={20} color="#fff" />
            </View>
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
    width: 130,
    height: 100,
    marginRight: 15,
    objectFit: 'contain',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  cardBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardArrow: {},
});

export default DeviceManagementScreen;
