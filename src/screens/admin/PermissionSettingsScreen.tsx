import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const PermissionSettingsScreen = () => {
  const [permissions, setPermissions] = useState([
    { id: 1, name: '設定項目 1', enabled: true },
    { id: 2, name: '設定項目 2', enabled: true },
    { id: 3, name: '設定項目 3', enabled: false },
    { id: 4, name: '設定項目 4', enabled: true },
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
    <View style={styles.container}>
      {permissions.map((permission) => (
        <View key={permission.id} style={styles.item}>
          <Text style={styles.label}>{permission.name}</Text>
          <Switch
            value={permission.enabled}
            onValueChange={() => togglePermission(permission.id)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  label: { fontSize: 16, color: '#2C3E50' },
});

export default PermissionSettingsScreen;
