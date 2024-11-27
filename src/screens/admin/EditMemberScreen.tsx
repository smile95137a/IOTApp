import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditMemberScreen = ({ route, navigation }) => {
  const { member } = route.params;
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [email, setEmail] = useState(member.email);
  const [profileImage, setProfileImage] = useState(
    'https://via.placeholder.com/100' // 默認圖片
  );

  const handleSave = () => {
    Alert.alert('保存成功', '會員資料已更新', [
      { text: '確定', onPress: () => navigation.goBack() },
    ]);
  };

  const handleEditProfileImage = () => {
    Alert.alert('修改頭像', '此功能尚未實現', [{ text: '確定' }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.fixedImageContainer}>
            <Image
              source={require('@/assets/iot-threeBall.png')}
              resizeMode="contain"
            />
          </View>
          {/* Header */}
          <View style={styles.header}>
            <Header title="會員管理" onBackPress={() => navigation.goBack()} />
          </View>
          <View style={styles.mainContainer}>
            {/* 頭像組件 */}
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={handleEditProfileImage}
              >
                <Icon name="camera-alt" size={20} color="#4285F4" />
              </TouchableOpacity>
            </View>

            {/* 會員資料表單 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>姓名：</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別：</Text>
              <TextInput
                style={styles.input}
                value={member.gender}
                editable={false}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>手機：</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email：</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* 按鈕組 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>確定</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.blacklistButton}
              onPress={() => Alert.alert('加入黑名單')}
            >
              <Text style={styles.blacklistText}>加入黑名單</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.unblacklistButton}
              onPress={() => Alert.alert('移出黑名單')}
            >
              <Text style={styles.unblacklistText}>移出黑名單</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => Alert.alert('刪除用戶')}
            >
              <Text style={styles.deleteText}>刪除用戶</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20, // 為滑動留出額外的底部空間
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  fixedImageContainer: {
    position: 'absolute',
    right: -200,
    bottom: 0,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.1,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 5,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  input: {
    borderRadius: 5,
    padding: 10,
    flex: 2,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#FF7043',
    padding: 15,
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blacklistButton: {
    backgroundColor: '#000000',
    padding: 15,
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  blacklistText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unblacklistButton: {
    backgroundColor: '#B0BEC5',
    padding: 15,
    alignItems: 'center',
    borderRadius: 50,
    marginBottom: 10,
  },
  unblacklistText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    alignItems: 'center',
    borderRadius: 50,
  },
  deleteText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditMemberScreen;
