import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  SafeAreaView,
  Image,
} from 'react-native';

const TableDetailsScreen = ({ route, navigation }) => {
  const { table } = route.params; // 獲取傳遞的桌台名稱
  const [light, setLight] = useState(false);
  const [ballLauncher, setBallLauncher] = useState(true);

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
          <Header title={table.name} onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {/* 開關項目 */}
          <View style={styles.item}>
            <Text style={styles.label}>桌台檯燈</Text>
            <Switch value={light} onValueChange={setLight} />
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>擊球器</Text>
            <Switch value={ballLauncher} onValueChange={setBallLauncher} />
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
    // Push it behind other content
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

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 15,

    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
});

export default TableDetailsScreen;
