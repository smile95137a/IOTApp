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
import Icon from 'react-native-vector-icons/MaterialIcons'; // 引入右箭頭圖標

const TableManagementScreen = ({ navigation }) => {
  const tables = [
    { name: '桌台 1' },
    { name: '桌台 2' },
    { name: '桌台 3' },
    { name: '桌台 4' },
  ];

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
          <Header title="桌台管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.gridContainer}>
            {tables.map((table, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => navigation.navigate('TableDetails', { table })}
              >
                <View style={styles.row}>
                  {/* 圖標和桌台名稱在同一行 */}
                  <Image
                    source={require('@/assets/iot-home1.png')} // 替換為桌台圖標路徑
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{table.name}</Text>
                </View>
                {/* 設定按鈕 */}
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => navigation.navigate('TableDetails', { table })}
                >
                  <Text style={styles.settingsButtonText}>設定</Text>
                  <Icon
                    name="chevron-right"
                    size={20}
                    color="#FFF"
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#2C9252',
    width: '49%',
    aspectRatio: 1.5,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginRight: 10, // 圖標和桌台名稱間距
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // 將按鈕內容靠右
  },
  settingsButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
  arrowIcon: {
    marginLeft: 5, // 與文字保持距離
  },
});

export default TableManagementScreen;
