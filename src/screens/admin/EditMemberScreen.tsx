import {
  addUsersToBlacklist,
  deleteUser,
  removeUsersFromBlacklist,
  updateUser,
} from '@/api/admin/adminUserApi';
import Header from '@/component/Header';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';
import { fetchAllRoles } from '@/api/admin/roleApi';
import CheckBox from 'expo-checkbox';

const EditMemberScreen = ({ route, navigation }) => {
  const { member } = route.params;
  console.log('@@@@@@@', member);

  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phoneNumber);
  const [email, setEmail] = useState(member.email);
  const [roles, setRoles] = useState([]);

  const memberRoles = member.roles.map((x) => x.roleName);
  const isBlackMember = memberRoles.includes('ROLE_BLACKLIST');
  const [selectedRoles, setSelectedRoles] = useState(
    member.roles.map((x) => x.roleName)
  );

  useEffect(() => {
    const loadRoles = async () => {
      try {
        dispatch(showLoading());
        const { success, data, message } = await fetchAllRoles();
        dispatch(hideLoading());
        if (success) {
          setRoles(data);
        } else {
          Alert.alert('錯誤', message || '無法獲取角色資訊');
        }
      } catch (error) {
        dispatch(hideLoading());
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        Alert.alert('錯誤', errorMessage);
      }
    };

    loadRoles();
  }, []);

  const handleSave = async () => {
    try {
      dispatch(showLoading());

      const { success, message } = await updateUser({
        id: member.id,
        name,
        phoneNumber: phone,
        email,
        roles: selectedRoles, // 這裡傳入選中的角色
      });

      console.log('@@@@@4444', {
        id: member.id,
        name,
        phoneNumber: phone,
        email,
        roles: selectedRoles, // 這裡傳入選中的角色
      });

      dispatch(hideLoading());

      if (success) {
        Alert.alert('更新成功', '會員資料已更新', [
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
        Alert.alert('錯誤', message || '無法更新會員資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Alert.alert('錯誤', errorMessage);
    }
  };

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

  const toggleRoleSelection = (roleName) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleName)
        ? prevSelectedRoles.filter((role) => role !== roleName)
        : [...prevSelectedRoles, roleName]
    );
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>角色：</Text>
            </View>
            <View style={styles.roleContainer}>
              {roles.map((item) => (
                <View key={item.roleName} style={styles.checkboxContainer}>
                  <CheckBox
                    value={selectedRoles.includes(item.roleName)}
                    onValueChange={() => toggleRoleSelection(item.roleName)}
                  />
                  <Text style={styles.checkboxLabel}>{item.roleName}</Text>
                </View>
              ))}
            </View>
            {/* 按鈕組 */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: { marginLeft: 10, fontSize: 16, color: '#333' },
});

export default EditMemberScreen;
