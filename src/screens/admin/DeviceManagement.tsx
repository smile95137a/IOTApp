import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const DeviceManagementScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('EnvironmentManagement')}
      >
        <Text style={styles.cardText}>環境管理</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('TableManagement')}
      >
        <Text style={styles.cardText}>桌檯管理</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardText: { fontSize: 18, fontWeight: 'bold' },
});

export default DeviceManagementScreen;
