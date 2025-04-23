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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { getImageUrl } from '@/utils/ImageUtils';
import { fetchAllRoles } from '@/api/admin/roleApi';
import CheckBox from 'expo-checkbox';
import HeaderBar from '@/component/admin/HeaderBar';
import { useDialog } from '@/context/DialogContext';
import { getErrorMessage } from '@/utils/errorUtils';

const EditMemberScreen = ({ route, navigation }) => {
  const { member } = route.params;
  const { openInfoDialog, openConfirmDialog } = useDialog();

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
          await openInfoDialog({
            title: '錯誤',
            content: message || '無法獲取角色資訊',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
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
        phone: phone,
        email,
        roleNames: selectedRoles, // 這裡傳入選中的角色
      });
      dispatch(hideLoading());

      if (success) {
        await openInfoDialog({
          title: '更新成功',
          content: '會員資料已更新',
          confirmText: '確定',
        });
        (navigation as any).reset({
          index: 0,
          routes: [{ name: 'MemberManagement' }],
        });
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法更新會員資訊',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleBlacklist = async () => {
    try {
      dispatch(showLoading());
      const { success, message } = await addUsersToBlacklist([member.id]);
      dispatch(hideLoading());
      if (success) {
        await openInfoDialog({
          title: '操作成功',
          content: `${name} 已加入黑名單`,
          confirmText: '確定',
        });
        (navigation as any).reset({
          index: 0,
          routes: [{ name: 'MemberManagement' }],
        });
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入資訊',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleUnblacklist = async () => {
    try {
      dispatch(showLoading());
      const { success, message } = await removeUsersFromBlacklist([member.id]);
      dispatch(hideLoading());
      if (success) {
        await openInfoDialog({
          title: '操作成功',
          content: `${name} 已移出黑名單`,
          confirmText: '確定',
        });
        (navigation as any).reset({
          index: 0,
          routes: [{ name: 'MemberManagement' }],
        });
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: message || '無法載入資訊',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const toggleRoleSelection = (roleName) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleName)
        ? prevSelectedRoles.filter((role) => role !== roleName)
        : [...prevSelectedRoles, roleName]
    );
  };

  const getGender = (gender: any) => {
    return gender === 'female' ? '女' : gender === 'male' ? '男' : '未知';
  };

  const getRoleCHName = (roleName: string): string => {
    const roleNameMap: Record<string, string> = {
      ROLE_ADMIN: '系統管理員',
      ROLE_USER: '一般會員',
      ROLE_MANUFACTURER: '加盟商',
      ROLE_STORE_MANAGER: '店長',
      ROLE_BLACKLIST: '黑名單',
    };

    return roleNameMap[roleName] || '';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.fixedImageContainer}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              resizeMode="contain"
            />
          </View>
          {/* Header */}
          <View style={styles.header}>
            <HeaderBar title="會員管理" />
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
              {roles
                .filter((role) => role.roleName !== 'ROLE_BLACKLIST')
                .map((item) => (
                  <View key={item.roleName} style={styles.checkboxContainer}>
                    <CheckBox
                      value={selectedRoles.includes(item.roleName)}
                      onValueChange={() => toggleRoleSelection(item.roleName)}
                    />
                    <Text style={styles.checkboxLabel}>
                      {getRoleCHName(item.roleName)}
                    </Text>
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
