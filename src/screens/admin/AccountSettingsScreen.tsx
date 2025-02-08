import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AccountSettingsScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('Wang');
  const [userPhone, setUserPhone] = useState('尚未設定');
  const [userRole, setUserRole] = useState('管理員');

  const editField = (field) => {
    console.log(`Edit ${field}`);
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
          <Header title="帳號設定" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {/* Profile Image */}
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIcon}>
              <Icon name="camera-alt" size={20} color="#4285F4" />
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.form}>
            <View style={styles.inputRow}>
              <Text style={styles.label}>名稱：</Text>
              <Text style={styles.value}>{userName}</Text>
              <TouchableOpacity onPress={() => editField('name')}>
                <Icon name="edit" size={20} color="#4285F4" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>手機：</Text>
              <Text style={styles.value}>{userPhone}</Text>
              <TouchableOpacity onPress={() => editField('phone')}>
                <Icon name="edit" size={20} color="#4285F4" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>重設密碼：</Text>
              <TouchableOpacity onPress={() => editField('password')}>
                <Text style={styles.value}>設定</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.label}>權限：</Text>
              <Text style={styles.value}>{userRole}</Text>
              <TouchableOpacity onPress={() => editField('role')}>
                <Icon name="edit" size={20} color="#4285F4" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>儲存</Text>
          </TouchableOpacity>
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
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
  },
  form: {
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#F67943',
    padding: 15,
    borderRadius: 50,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AccountSettingsScreen;
