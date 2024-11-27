import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

const EditMemberScreen = ({ route, navigation }) => {
  const { member } = route.params;
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [email, setEmail] = useState(member.email);

  // 處理按鈕事件
  const handleSave = () => {
    Alert.alert('保存成功', '會員資料已更新', [
      { text: '確定', onPress: () => navigation.goBack() },
    ]);
  };

  const handleAddToBlacklist = () => {
    Alert.alert('確認加入黑名單', `確定將 ${name} 加入黑名單嗎？`, [
      { text: '取消', style: 'cancel' },
      { text: '確定', onPress: () => Alert.alert('已加入黑名單') },
    ]);
  };

  const handleRemoveFromBlacklist = () => {
    Alert.alert('確認移出黑名單', `確定將 ${name} 從黑名單移出嗎？`, [
      { text: '取消', style: 'cancel' },
      { text: '確定', onPress: () => Alert.alert('已移出黑名單') },
    ]);
  };

  const handleDeleteUser = () => {
    Alert.alert('確認刪除會員', `確定刪除會員 ${name} 嗎？此操作不可恢復。`, [
      { text: '取消', style: 'cancel' },
      {
        text: '刪除',
        style: 'destructive',
        onPress: () => {
          Alert.alert('會員已刪除');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 會員資料表單 */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>姓名：</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>性別：</Text>
        <TextInput
          style={styles.input}
          value={member.gender}
          editable={false} // 性別不可修改
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>手機：</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email：</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>

      {/* 按鈕組 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>確定</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.blacklistButton}
        onPress={handleAddToBlacklist}
      >
        <Text style={styles.blacklistText}>加入黑名單</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.unblacklistButton}
        onPress={handleRemoveFromBlacklist}
      >
        <Text style={styles.unblacklistText}>移出黑名單</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteUser}>
        <Text style={styles.deleteText}>刪除用戶</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: '#FF7043',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  blacklistButton: {
    backgroundColor: '#000',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  blacklistText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  unblacklistButton: {
    backgroundColor: '#607D8B',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  unblacklistText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  deleteText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default EditMemberScreen;
