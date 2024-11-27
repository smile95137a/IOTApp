import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

const MemberDetailsScreen = ({ route, navigation }) => {
  const { member } = route.params;

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
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  memberName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  memberInfo: { fontSize: 16, color: '#555', marginBottom: 5 },
  editButton: {
    marginTop: 20,
    backgroundColor: '#F67943',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 100,
    alignItems: 'center',
  },
  editButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default MemberDetailsScreen;
