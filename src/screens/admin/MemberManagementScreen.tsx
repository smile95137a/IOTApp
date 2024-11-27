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
} from 'react-native';

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
    <View style={styles.container}>
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
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberPhone}>{item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.batchActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleBatchDelete}
        >
          <Text style={styles.actionButtonText}>批次刪除</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>加入黑名單</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>移出黑名單</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
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
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  selectedMember: { backgroundColor: '#D3F2D8' },
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
    backgroundColor: '#FF7043',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
});

export default MemberManagementScreen;
