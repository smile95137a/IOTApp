import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Image,
  SafeAreaView,
} from 'react-native';

const PermissionSettingsScreen = ({ navigation }) => {
  const [permissions, setPermissions] = useState([
    {
      id: 1,
      name: '設定項目 1',
      description: '說明說明說明說明說明說明說明說明說明說明',
      enabled: true,
    },
    {
      id: 2,
      name: '設定項目 2',
      description: '說明說明說明說明說明說明說明說明說明說明',
      enabled: true,
    },
    {
      id: 3,
      name: '設定項目 3',
      description: '說明說明說明說明說明說明說明說明說明說明',
      enabled: false,
    },
    {
      id: 4,
      name: '設定項目 4',
      description: '說明說明說明說明說明說明說明說明說明說明',
      enabled: true,
    },
  ]);

  const togglePermission = (id) => {
    setPermissions((prev) =>
      prev.map((permission) =>
        permission.id === id
          ? { ...permission, enabled: !permission.enabled }
          : permission
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
          <Header title="權限設定" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {permissions.map((permission) => (
            <View key={permission.id} style={styles.item}>
              {/* 第一行：名稱和開關 */}
              <View style={styles.row}>
                <Text style={styles.label}>{permission.name}</Text>
                <Switch
                  value={permission.enabled}
                  onValueChange={() => togglePermission(permission.id)}
                />
              </View>
              {/* 第二行：描述 */}
              <Text style={styles.description}>{permission.description}</Text>
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
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5, // 分隔第一行與第二行
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  description: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 18,
  },
});

export default PermissionSettingsScreen;
