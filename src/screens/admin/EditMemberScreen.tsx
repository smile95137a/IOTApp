import {
  addUsersToBlacklist,
  deleteUser,
  removeUsersFromBlacklist,
  updateUser,
} from '@/api/admin/adminUserApi';
import Header from '@/component/Header';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
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
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';

const EditMemberScreen = ({ route, navigation }) => {
  const { member } = route.params;
  console.log('@@@@@@@', member);

  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phoneNumber);
  const [email, setEmail] = useState(member.email);
  const [profileImage, setProfileImage] = useState(
    'https://via.placeholder.com/100' // 默認圖片
  );

  const memberRoles = member.roles.map((x) => x.roleName);
  const isBlackMember = memberRoles.includes('ROLE_BLACKLIST');

  // const handleSave = async () => {
  //   try {
  //     dispatch(showLoading());
  //     console.log('@@@@@', {
  //       id: member.id,
  //       name,
  //       phoneNumber: phone,
  //       email,
  //     });

  //     const { success, message } = await updateUser({
  //       id: member.id,
  //       name,
  //       phoneNumber: phone,
  //       email,
  //     });
  //     dispatch(hideLoading());
  //     if (success) {
  //       Alert.alert('保存成功', '會員資料已更新', [
  //         {
  //           text: '確定',
  //           onPress: () => {
  //             navigation.reset({
  //               index: 0,
  //               routes: [{ name: 'MemberManagement' }],
  //             });
  //           },
  //         },
  //       ]);
  //     } else {
  //       Alert.alert('錯誤', message || '無法載入資訊');
  //     }
  //   } catch (error) {
  //     dispatch(hideLoading());
  //     const errorMessage =
  //       error instanceof Error ? error.message : String(error);
  //     Alert.alert('錯誤', errorMessage);
  //   }
  // };

  const handleBlacklist = async () => {
    try {
      dispatch(showLoading());
      const { success, message } = await addUsersToBlacklist([member.id]);
      dispatch(hideLoading());
      if (success) {
        Alert.alert('操作成功', `${name} 已加入黑名單`, [
          {
            text: '確定',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MemberManagement' }],
              });
            },
          },
        ]);
      } else {
        Alert.alert('錯誤', message || '無法載入資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert('錯誤', errorMessage);
    }
  };

  const handleUnblacklist = async () => {
    try {
      dispatch(showLoading());
      const { success, message } = await removeUsersFromBlacklist([member.id]);
      dispatch(hideLoading());
      if (success) {
        Alert.alert('操作成功', `${name} 已移出黑名單`, [
          {
            text: '確定',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MemberManagement' }],
              });
            },
          },
        ]);
      } else {
        Alert.alert('錯誤', message || '無法載入資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert('錯誤', errorMessage);
    }
  };

  const handleDeleteUser = async () => {
    Alert.alert('刪除確認', `確定要刪除 ${name} 嗎？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '確定',
        onPress: async () => {
          try {
            dispatch(showLoading());
            const { success, message } = await deleteUser(member.id);
            dispatch(hideLoading());
            if (success) {
              Alert.alert('刪除成功', '用戶已刪除', [
                {
                  text: '確定',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'MemberManagement' }],
                    });
                  },
                },
              ]);
            } else {
              Alert.alert('錯誤', message || '無法載入資訊');
            }
          } catch (error) {
            dispatch(hideLoading());
            const errorMessage =
              error instanceof Error ? error.message : String(error);
            Alert.alert('錯誤', errorMessage);
          }
        },
      },
    ]);
  };

  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相簿權限');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相機權限');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const getGender = (gender) => {
    return gender === 'female' ? '女' : gender === 'male' ? '男' : '未知';
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
                source={
                  member?.userImg
                    ? { uri: getImageUrl(member.userImg) }
                    : require('@/assets/iot-user-logo.jpg')
                }
                style={styles.profileImage}
              />
            </View>

            {/* 會員資料表單 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>姓名：</Text>
              <Text style={styles.inputVal}>{name}</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>性別：</Text>
              <Text style={styles.inputVal}>{getGender(member.gender)}</Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>手機：</Text>
              <Text style={styles.inputVal}>
                {member.countryCode}
                {member.phoneNumber}
              </Text>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email：</Text>
              <Text style={styles.inputVal}>{email}</Text>
            </View>

            {/* 按鈕組 */}
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>確定</Text>
            </TouchableOpacity>

            {isBlackMember ? (
              <TouchableOpacity
                style={styles.unblacklistButton}
                onPress={handleUnblacklist}
              >
                <Text style={styles.unblacklistText}>移出黑名單</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.blacklistButton}
                onPress={handleBlacklist}
              >
                <Text style={styles.blacklistText}>加入黑名單</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteUser}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    marginLeft: 20,
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
  inputVal: {
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
