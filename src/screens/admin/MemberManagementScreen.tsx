import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const members = [
  { id: '1', name: '王小明', phone: '0912345678', points: 1200 },
  { id: '2', name: '李大華', phone: '0922334455', points: 800 },
  { id: '3', name: '陳美美', phone: '0933445566', points: 1500 },
];

const MemberManagementScreen = () => {
  const renderMember = ({ item }) => (
    <View style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberDetails}>電話: {item.phone}</Text>
        <Text style={styles.memberDetails}>積分: {item.points}</Text>
      </View>
      <TouchableOpacity style={styles.manageButton}>
        <Icon name="eye" size={20} color="#fff" />
        <Text style={styles.manageButtonText}>查看</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>會員管理</Text>
        </View>

        {/* Member List */}
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  header: {
    marginVertical: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  listContainer: {
    paddingBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  memberDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#409D62',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  manageButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
  },
});

export default MemberManagementScreen;
