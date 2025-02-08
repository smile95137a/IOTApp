import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EnvironmentManagementScreen = ({ navigation }) => {
  const [lights, setLights] = useState([
    {
      id: 1,
      name: '電燈 1',
      enabled: true,
      startTime: '06:00',
      endTime: '23:59',
    },
    {
      id: 2,
      name: '電燈 2',
      enabled: true,
      startTime: '06:00',
      endTime: '23:59',
    },
    {
      id: 3,
      name: '電燈 3',
      enabled: false,
      startTime: '06:00',
      endTime: '23:59',
    },
    {
      id: 4,
      name: '冷氣',
      enabled: true,
      startTime: '06:00',
      endTime: '23:59',
    },
  ]);

  const toggleSwitch = (id) => {
    setLights((prev) =>
      prev.map((light) =>
        light.id === id ? { ...light, enabled: !light.enabled } : light
      )
    );
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
          <Header title="環境管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {lights.map((light) => (
            <View key={light.id} style={styles.item}>
              {/* 名稱與開關 */}
              <View style={styles.row}>
                <View style={styles.nameRow}>
                  <Text style={styles.label}>{light.name}</Text>
                  <TouchableOpacity>
                    <Icon
                      name="edit"
                      size={16}
                      color="#4285F4"
                      style={styles.editIcon}
                    />
                  </TouchableOpacity>
                </View>
                <Switch
                  value={light.enabled}
                  onValueChange={() => toggleSwitch(light.id)}
                />
              </View>
              {/* 時間設置 */}
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>自動啟閉：</Text>
                <TouchableOpacity style={styles.timeEdit}>
                  <Text style={styles.timeText}>{light.startTime}</Text>
                  <Icon name="edit" size={14} color="#4285F4" />
                </TouchableOpacity>
                <Text style={styles.timeLabel}>開啟</Text>
                <TouchableOpacity style={styles.timeEdit}>
                  <Text style={styles.timeText}>{light.endTime}</Text>
                  <Icon name="edit" size={14} color="#4285F4" />
                </TouchableOpacity>
                <Text style={styles.timeLabel}>關閉</Text>
              </View>
            </View>
          ))}
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

  item: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 4,

    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  editIcon: {
    marginLeft: 5,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 5,
  },
  timeEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#4285F4',
    marginRight: 3,
  },
});

export default EnvironmentManagementScreen;
