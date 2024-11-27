import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TableManagementScreen = ({ navigation }) => {
  const tables = ['桌台 1', '桌台 2', '桌台 3', '桌台 4'];

  return (
    <View style={styles.container}>
      {tables.map((table, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate('TableDetails', { table })}
        >
          <Text style={styles.cardText}>{table}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#8BC34A',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  cardText: { fontSize: 18, color: '#FFF', fontWeight: 'bold' },
});

export default TableManagementScreen;
