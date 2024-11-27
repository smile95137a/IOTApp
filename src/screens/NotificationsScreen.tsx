import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@/component/Header';

const notifications = [
  {
    id: 1,
    date: '2024.11.10',
    title: '系統更新通知',
    status: '未讀',
    content: '這是一個系統更新通知的詳細內容...',
  },
  {
    id: 2,
    date: '2024.11.09',
    title: '板橋旗艦店開幕',
    status: '未讀',
    content: '板橋旗艦店盛大開幕，歡迎蒞臨...',
  },
  {
    id: 3,
    date: '2024.10.30',
    title: '系統更新通知',
    status: '未讀',
    content: '這是一個系統更新通知的詳細內容...'.repeat(50), // 模擬長文本內容
  },
  {
    id: 4,
    date: '2024.09.25',
    title: '系統更新通知',
    status: '已讀',
    content: '這是一個系統更新通知的詳細內容...',
  },
  {
    id: 5,
    date: '2024.09.15',
    title: '系統更新通知',
    status: '已讀',
    content: '這是一個系統更新通知的詳細內容...',
  },
];

const NotificationsScreen = ({ navigation }: any) => {
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openNotification = (item: any) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  const renderNotification = ({ item }: { item: any }) => (
    <View style={styles.notificationItem}>
      <View>
        <Text style={styles.notificationDate}>{item.date}</Text>
        <Text style={styles.notificationTitle}>{item.title}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.notificationButton,
          item.status === '未讀' ? styles.unreadButton : styles.readButton,
        ]}
        onPress={() => openNotification(item)}
      >
        <View style={styles.notificationButtonContent}>
          <Icon
            name="add" // 使用 MaterialIcons 的 `add` 图标
            style={[
              styles.notificationButtonIcon,
              item.status === '未讀'
                ? styles.unreadButtonText
                : styles.readButtonText,
            ]}
          />
          <Text
            style={[
              styles.notificationButtonText,
              item.status === '未讀'
                ? styles.unreadButtonText
                : styles.readButtonText,
            ]}
          >
            {item.status === '未讀' ? '閱讀' : '已讀'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="訊息通知"
        onBackPress={() => navigation.goBack()}
        rightIcon="settings"
        onRightPress={() => console.log('Settings pressed')}
        titleColor="#FFF"
        iconColor="#FFF"
      />

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalDate}>
              {selectedNotification?.date} {selectedNotification?.title}
            </Text>

            {/* 滾動內容 */}
            <ScrollView style={styles.modalContentScroll}>
              <Text style={styles.modalContent}>
                {selectedNotification?.content}
              </Text>
            </ScrollView>

            {/* 關閉按鈕 */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Icon name="close" style={styles.modalCloseIcon} />
              <Text style={styles.modalCloseButtonText}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  notificationDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  notificationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationButtonIcon: {
    fontSize: 16, // 图标大小
    marginRight: 5, // 图标与文字间距
  },
  unreadButton: {
    backgroundColor: '#F67943',
  },
  readButton: {
    backgroundColor: '#CCC',
  },
  notificationButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unreadButtonText: {
    color: '#FFF',
  },
  readButtonText: {
    color: '#666',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalContentScroll: {
    flexGrow: 0,
    maxHeight: 480, // 限制滾動內容的最大高度
    marginBottom: 20, // 與按鈕保持間距
  },
  modalContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#F67943',
  },
  modalCloseButtonText: {
    fontSize: 14,
    color: '#F67943',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalCloseIcon: {
    fontSize: 16,
    color: '#F67943',
  },
});

export default NotificationsScreen;
