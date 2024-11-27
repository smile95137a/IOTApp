import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const MemberDetailsScreen = ({ route, navigation }) => {
  const { member } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/100' }}
        style={styles.profileImage}
      />
      <Text style={styles.memberName}>{member.name}</Text>
      <Text style={styles.memberInfo}>性別：{member.gender}</Text>
      <Text style={styles.memberInfo}>手機：{member.phone}</Text>
      <Text style={styles.memberInfo}>Email：{member.email}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditMemberScreen', { member })}
      >
        <Text style={styles.editButtonText}>編輯</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  memberName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  memberInfo: { fontSize: 16, color: '#555', marginBottom: 5 },
  editButton: {
    marginTop: 20,
    backgroundColor: '#FF7043',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  editButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default MemberDetailsScreen;
