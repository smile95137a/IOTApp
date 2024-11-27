import Header from '@/component/Header';
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MemberManagementScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const members = [
    {
      id: '1',
      name: '王小明',
      phone: '0927123456',
      email: 'wangming@gmail.com',
      gender: '男',
    },
    {
      id: '2',
      name: '李小華',
      phone: '0912345678',
      email: 'lihua@gmail.com',
      gender: '女',
    },
    {
      id: '3',
      name: '張小龍',
      phone: '0935123456',
      email: 'zhanglong@gmail.com',
      gender: '男',
    },
  ];

  const filteredMembers = members.filter(
    (member) =>
      member.name.includes(searchText) ||
      member.phone.includes(searchText) ||
      member.email.includes(searchText)
  );

  const handleSelectMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((memberId) => memberId !== id)
        : [...prev, id]
    );
  };

  const handleBatchDelete = () => {
    Alert.alert(
      '批次刪除',
      `確定刪除 ${selectedMembers.length} 筆會員資料嗎？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '確定', onPress: () => Alert.alert('已刪除') },
      ]
    );
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
          <Header title="會員管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜尋姓名、手機或電子郵件"
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={filteredMembers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.memberItem,
                  selectedMembers.includes(item.id) && styles.selectedMember,
                ]}
                onPress={() =>
                  navigation.navigate('MemberDetailsScreen', { member: item })
                }
                onLongPress={() => handleSelectMember(item.id)}
              >
                <Image
                  source={{ uri: 'https://via.placeholder.com/50' }}
                  style={styles.memberImage}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Text style={styles.memberPhone}>{item.phone}</Text>
                </View>
                <TouchableOpacity
                  style={styles.arrowContainer}
                  onPress={() =>
                    navigation.navigate('MemberDetailsScreen', { member: item })
                  }
                >
                  <Icon name="chevron-right" size={24} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          <View style={styles.batchActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleBatchDelete}
            >
              <Text style={styles.actionButtonText}>批次刪除</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.blacklistButton]}
            >
              <Text style={styles.actionButtonText}>加入黑名單</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.removeBlacklistButton]}
            >
              <Text style={styles.actionButtonText}>移出黑名單</Text>
            </TouchableOpacity>
          </View>
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
    elevation: 2,
  },
  selectedMember: { backgroundColor: '#D3F2D8' },
  memberInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },

  memberImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  memberName: { fontSize: 16, fontWeight: 'bold' },
  memberPhone: { color: '#666' },
  batchActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 100,
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  deleteButton: {
    backgroundColor: '#F67943',
  },
  blacklistButton: {
    backgroundColor: '#000000',
  },
  removeBlacklistButton: {
    backgroundColor: '#8A9493',
  },
});

export default MemberManagementScreen;
