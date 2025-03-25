import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from '@/component/Header';
import { fetchAllNews } from '@/api/newsApi';
import DateFormatter from '@/component/DateFormatter';

const NotificationsScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetchAllNews();
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    loadNews();
  }, []);

  const openNotification = (item: any) => {
    setSelectedNotification(item);
    setModalVisible(true);
  };

  return (
    <>
      <ScrollView>
        {notifications.map((item) => (
          <View key={item.id} style={styles.notificationItem}>
            <View>
              <Text style={styles.notificationDate}>
                <DateFormatter date={item.createdDate} format="YYYY.MM.DD" />
              </Text>
              <Text style={styles.notificationTitle}>{item.title}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.notificationButton,
                item.isRead === '未讀'
                  ? styles.unreadButton
                  : styles.readButton,
              ]}
              onPress={() => openNotification(item)}
            >
              <View style={styles.notificationButtonContent}>
                <Icon
                  name="add"
                  style={[
                    styles.notificationButtonIcon,
                    item.isRead === '未讀'
                      ? styles.unreadButtonText
                      : styles.readButtonText,
                  ]}
                />
                <Text
                  style={[
                    styles.notificationButtonText,
                    item.isRead === '未讀'
                      ? styles.unreadButtonText
                      : styles.readButtonText,
                  ]}
                >
                  {item.isRead === '未讀' ? '閱讀' : '已讀'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal for Notification Detail */}
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

            <ScrollView style={styles.modalContentScroll}>
              <Text style={styles.modalContent}>
                {selectedNotification?.content}
              </Text>
            </ScrollView>

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
    </>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
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
    fontSize: 16,
    marginRight: 5,
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
  },
  modalDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalContentScroll: {
    flexGrow: 0,
    maxHeight: 480,
    marginBottom: 20,
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
