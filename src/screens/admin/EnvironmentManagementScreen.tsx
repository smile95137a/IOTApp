import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TextInput } from 'react-native';

const EnvironmentManagementScreen = () => {
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
    <View style={styles.container}>
      {lights.map((light) => (
        <View key={light.id} style={styles.item}>
          <Text style={styles.label}>{light.name}</Text>
          <Switch
            value={light.enabled}
            onValueChange={() => toggleSwitch(light.id)}
          />
          <View style={styles.timeInputContainer}>
            <TextInput style={styles.timeInput} value={light.startTime} />
            <Text>~</Text>
            <TextInput style={styles.timeInput} value={light.endTime} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  label: { fontSize: 16 },
  timeInputContainer: { flexDirection: 'row', alignItems: 'center' },
  timeInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 5,
    borderRadius: 5,
    width: 60,
    marginHorizontal: 5,
  },
});

export default EnvironmentManagementScreen;
