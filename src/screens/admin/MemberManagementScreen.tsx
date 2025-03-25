import { fetchAllUsers } from '@/api/admin/adminUserApi';
import HeaderBar from '@/component/admin/HeaderBar';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { getImageUrl } from '@/utils/ImageUtils';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

const MemberManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState<any[]>([]);

  const filteredMembers = userList.filter(
    (member) =>
      member.name.includes(searchText) || member.email.includes(searchText)
  );

  const loadMembers = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllUsers();
      dispatch(hideLoading());
      if (success) {
        setUserList(data);
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

  useEffect(() => {
    loadMembers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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

        {/* Main Content */}
        <View style={styles.mainContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋姓名、手機或電子郵件"
            value={searchText}
            onChangeText={setSearchText}
          />

          <ScrollView>
            {filteredMembers.map((item) => (
              <TouchableOpacity
                key={item.uid}
                style={styles.memberItem}
                onPress={() =>
                  navigation.navigate('MemberDetails', { member: item })
                }
              >
                <Image
                  source={
                    item?.userImg
                      ? { uri: getImageUrl(item.userImg) }
                      : require('@/assets/iot-user-logo.jpg')
                  }
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberPhone}>
                    {item.countryCode}
                    {item.phoneNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() =>
                    navigation.navigate('MemberDetails', { member: item })
                  }
                >
                  <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberPhone: {
    color: '#666',
  },
});

export default MemberManagementScreen;
