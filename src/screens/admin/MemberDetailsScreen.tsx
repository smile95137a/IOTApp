import Header from '@/component/Header';
import NumberFormatter from '@/component/NumberFormatter';
import { getImageUrl } from '@/utils/ImageUtils';
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
  const getGender = (gender) => {
    return gender === 'female' ? '女' : gender === 'male' ? '男' : '未知';
  };

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
          <Header title="會員管理" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={
                member?.userImg
                  ? { uri: getImageUrl(member.userImg) }
                  : require('@/assets/iot-user-logo.jpg')
              }
              style={styles.profileImage}
            />
            <Text style={styles.memberName}>{member.name}</Text>
          </View>
          <Text style={styles.memberInfo}>
            性別：{getGender(member.gender)}
          </Text>
          <Text style={styles.memberInfo}>
            手機： {member.countryCode}
            {member.phoneNumber}
          </Text>
          <Text style={styles.memberInfo}>Email：{member.email}</Text>
          <View style={styles.divider} />

          <View style={styles.spendingContainer}>
            <Text style={styles.spendingText}>
              消費總額：
              <NumberFormatter number={~~member.totalAmount} />元
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditMember', { member })}
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 20,
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
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
    width: '100%',
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
  },
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
  spendingContainer: {
    width: '100%',
    flex: 1,
  },
  spendingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MemberDetailsScreen;
