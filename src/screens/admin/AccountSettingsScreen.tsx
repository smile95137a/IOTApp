import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const AccountSettingsScreen = () => {
  const [name, setName] = useState('Wang');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('管理員');

  return (
    <View style={styles.container}>
      {/* 頭像 */}
      <View style={styles.profileImageContainer}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIcon}>
          <Text>📷</Text>
        </TouchableOpacity>
      </View>

      {/* 個人信息 */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>名稱：</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>手機：</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="尚未設定"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>權限：</Text>
          <TextInput style={styles.input} value={role} editable={false} />
        </View>
      </View>

      {/* 儲存按鈕 */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>儲存</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  profileImageContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 120,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
    elevation: 3,
  },
  form: { marginTop: 20 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#FF7043',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default AccountSettingsScreen;
