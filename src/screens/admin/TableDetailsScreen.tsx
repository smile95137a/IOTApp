import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const TableDetailsScreen = ({ route }) => {
  const { table } = route.params;
  const [light, setLight] = useState(false);
  const [ballLauncher, setBallLauncher] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{table}</Text>
      <View style={styles.item}>
        <Text style={styles.label}>桌台權燈</Text>
        <Switch value={light} onValueChange={setLight} />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>擊球器</Text>
        <Switch value={ballLauncher} onValueChange={setBallLauncher} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: { fontSize: 16 },
});

export default TableDetailsScreen;
