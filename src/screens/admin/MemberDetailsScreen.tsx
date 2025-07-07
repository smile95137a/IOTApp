import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import HeaderBar from '../../component/admin/HeaderBar';
import NumberFormatter from '../../component/NumberFormatter';
import { getImageUrl } from '../../utils/ImageUtils';

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
            source={require('../../assets/iot-admin-bg.png')}
            style={{ width: '100%' }}
            resizeMode="contain"
          />
        </View>
        <View style={styles.header}>
          <HeaderBar showLeftButton title="會員管理" />
        </View>
        <View style={styles.mainContainer}>
          <View style={styles.profileContainer}>
            {member?.userImg ? (
              <Image
                source={{ uri: getImageUrl(member.userImg) }}
                style={styles.profileImage}
              />
            ) : member?.gender === 'female' ? (
              <Image
                source={require('../../assets/iot-girl.png')}
                style={styles.profileImage}
              />
            ) : member?.gender === 'male' ? (
              <Image
                source={require('../../assets/iot-boy.png')}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require('../../assets/iot-user-logo.jpg')}
                style={styles.profileImage}
              />
            )}

            <Text style={styles.memberName}>{member.name}</Text>
          </View>
          <Text style={styles.memberInfo}>UUID：{member.uid}</Text>
          {/* 新增：暱稱 */}
          <Text style={styles.memberInfo}>
            暱稱：{member.anonymousId || ''}
          </Text>

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
            {/* 修改：消費總額與筆數 */}
            <Text style={styles.spendingText}>
              消費總額：
              <NumberFormatter number={member.totalConsumptionAmount} />
              元（{member.totalConsumptionCount || 0} 筆）
            </Text>

            {/* 新增：儲值總額與筆數 */}
            <Text style={styles.spendingText}>
              儲值總額：
              <NumberFormatter number={member.totalDepositsAmount} />
              元（{member.totalDepositsCount || 0} 筆）
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              (navigation as any).navigate('EditMember', { member })
            }
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
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 20,
  },
  fixedImageContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
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
