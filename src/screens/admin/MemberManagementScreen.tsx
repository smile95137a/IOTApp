import { fetchAllUsers, addPoint } from '@/api/admin/adminUserApi';
import HeaderBar from '@/component/admin/HeaderBar';
import NumberFormatter from '@/component/NumberFormatter';
import { useDialog } from '@/context/DialogContext';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { getErrorMessage } from '@/utils/errorUtils';
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
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

const MemberManagementScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchText, setSearchText] = useState('');
  const [userList, setUserList] = useState<any[]>([]);
  const { openInfoDialog } = useDialog();
  const [isPointModalVisible, setIsPointModalVisible] = useState(false);
  const [pointAmount, setPointAmount] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

  const filteredMembers = userList.filter((member) => {
    const keyword = searchText.toLowerCase();
    return (
      member.name?.toLowerCase().includes(keyword) ||
      member.email?.toLowerCase().includes(keyword) ||
      member.anonymousId?.toLowerCase().includes(keyword) ||
      member.uid?.toLowerCase().includes(keyword) ||
      member.phoneNumber?.includes(keyword)
    );
  });

  const loadMembers = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await fetchAllUsers();
      dispatch(hideLoading());
      if (success) {
        setUserList(data);
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

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedUsers([]);
  };

  const toggleUserSelection = (user: any) => {
    if (selectedUsers.some((item) => item.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((item) => item.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const isUserSelected = (user: any) => {
    return selectedUsers.some((item) => item.id === user.id);
  };

  const handleOpenPointModal = () => {
    if (selectedUsers.length === 0) {
      openInfoDialog({
        title: '提醒',
        content: '請先選擇會員',
        confirmText: '我知道了',
      });
      return;
    }
    setIsPointModalVisible(true);
    setPointAmount('');
  };

  const handleAddPoints = async () => {
    if (
      selectedUsers.length === 0 ||
      !pointAmount ||
      isNaN(Number(pointAmount))
    ) {
      await openInfoDialog({
        title: '錯誤',
        content: '請選擇會員並輸入有效的點數',
        confirmText: '我知道了',
      });
      return;
    }

    try {
      dispatch(showLoading());
      setIsPointModalVisible(false);

      const userIds = selectedUsers.map((user) => user.id);

      const pointReq = {
        userId: userIds,
        point: pointAmount,
      };

      const result = await addPoint(pointReq);
      dispatch(hideLoading());

      if (result.success) {
        await openInfoDialog({
          title: '成功',
          content: `已成功發放 ${pointAmount} 點獎勵金給 ${selectedUsers.length} 位會員`,
          confirmText: '我知道了',
        });
        setIsSelectionMode(false);
        setSelectedUsers([]);
        await loadMembers();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: result.message || '獎勵金發放失敗',
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
          <View style={styles.toolbarContainer}>
            <TextInput
              style={[styles.searchInput, isSelectionMode && { width: '70%' }]}
              placeholder="搜尋姓名、手機或電子郵件"
              value={searchText}
              onChangeText={setSearchText}
            />

            {isSelectionMode ? (
              <View style={styles.selectionToolbar}>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={handleOpenPointModal}
                >
                  <Icon name="monetization-on" size={24} color="#FFC107" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolbarButton}
                  onPress={toggleSelectionMode}
                >
                  <Icon name="close" size={24} color="#F44336" />
                </TouchableOpacity>
                <Text style={styles.selectedCount}>
                  已選：{selectedUsers.length}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.selectModeButton}
                onPress={toggleSelectionMode}
              >
                <Icon name="playlist-add-check" size={24} color="#2196F3" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView>
            {filteredMembers.map((item) => (
              <TouchableOpacity
                key={item.uid}
                style={[
                  styles.memberItem,
                  isUserSelected(item) && styles.selectedMemberItem,
                ]}
                onPress={() => {
                  if (isSelectionMode) {
                    toggleUserSelection(item);
                  } else {
                    (navigation as any).navigate('MemberDetails', {
                      member: item,
                    });
                  }
                }}
              >
                {isSelectionMode && (
                  <View style={styles.checkboxContainer}>
                    <Icon
                      name={
                        isUserSelected(item)
                          ? 'check-box'
                          : 'check-box-outline-blank'
                      }
                      size={24}
                      color={isUserSelected(item) ? '#2196F3' : '#AAAAAA'}
                    />
                  </View>
                )}

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
                  <Text style={styles.memberId}>UUID：{item.uid}</Text>
                  {item.anonymousId && (
                    <Text style={styles.memberId}>
                      匿名 ID：{item.anonymousId}
                    </Text>
                  )}
                  <Text style={styles.memberPhone}>
                    {item.countryCode}
                    {item.phoneNumber}
                  </Text>
                  <Text style={styles.userBalance}>
                    儲值金額：
                    <NumberFormatter number={item.amount ?? 0} />
                    （消費優先扣除）
                  </Text>
                  <Text style={styles.userBalance}>
                    贈送：
                    <NumberFormatter number={item.point ?? 0} />
                  </Text>
                  <Text style={styles.userBalance}>
                    可用餘額：
                    <NumberFormatter number={item.balance ?? 0} />
                  </Text>
                </View>

                {!isSelectionMode && (
                  <TouchableOpacity
                    style={styles.arrowContainer}
                    onPress={() =>
                      (navigation as any).navigate('MemberDetails', {
                        member: item,
                      })
                    }
                  >
                    <Icon name="chevron-right" size={24} color="#666" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Point Modal */}
        <Modal
          visible={isPointModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsPointModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>發放點數</Text>
              <Text style={styles.modalSubtitle}>
                選擇的會員數量: {selectedUsers.length}
              </Text>

              <TextInput
                style={styles.pointInput}
                placeholder="輸入點數"
                keyboardType="numeric"
                value={pointAmount}
                onChangeText={setPointAmount}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsPointModalVisible(false)}
                >
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddPoints}
                >
                  <Text style={styles.buttonText}>確定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    flex: 1,
  },
  selectModeButton: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  toolbarButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  selectedCount: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontWeight: 'bold',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  selectedMemberItem: {
    backgroundColor: '#FFF',
    borderColor: '#2196F3',
    borderWidth: 1,
    borderBottomColor: '#2196F3',
  },
  checkboxContainer: {
    padding: 5,
    marginRight: 5,
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
  memberId: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  pointInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  userBalance: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
});

export default MemberManagementScreen;
