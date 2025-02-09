import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { endGame, startGame } from '@/api/gameApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useDispatch } from 'react-redux';

const ContactScreen = ({ navigation, route }) => {
  const { transaction } = route.params || {}; // 安全獲取 transaction
  const [elapsedTime, setElapsedTime] = useState(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (transaction?.startTime) {
      const startTime = moment(transaction.startTime);
      const updateTimer = () => {
        const now = moment();
        setElapsedTime(now.diff(startTime, 'seconds'));
      };

      updateTimer(); // 立即更新一次
      const timer = setInterval(updateTimer, 1000);

      return () => clearInterval(timer);
    }
  }, [transaction]);

  // 計算小時、分鐘、秒
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  // 點擊結束球局
  const handleEndGame = async () => {
    try {
      dispatch(showLoading());
      const { success, data, message } = await endGame({
        gameId: transaction.gameId,
      });
      dispatch(hideLoading());
      if (success) {
        navigation.navigate('Payment', {
          type: 'gameEnd',
          payData: { uid: transaction.gameId },
          totalAmount: data.totalPrice,
        });
      } else {
        Alert.alert('錯誤', message || '無法載入店家資訊');
      }
    } catch (error) {
      dispatch(hideLoading());
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      Alert.alert('錯誤', errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.timerSection}>
          <Text style={styles.price}>100元/小時</Text>
          <Text style={styles.timerText}>球局已進行</Text>
          <View style={styles.timerTimeContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>
                {String(hours).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timerColon}>小時</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>
                {String(minutes).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.timerColon}>分</Text>
          </View>
        </View>

        <View style={styles.contactContainer}>
          <FontAwesome
            name="phone"
            size={24}
            color="#424242"
            style={styles.contactIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contactTitle}>聯絡店長</Text>
            <Text style={styles.contactSubtitle}>
              機台操作問題，請聯繫{transaction?.vendorName}店長！
            </Text>
          </View>
        </View>

        {/* Warm Tips Section */}
        <View style={styles.warmTipsSection}>
          <Text style={styles.warmTipsHeader}>溫馨提示：</Text>
          {Array.from({ length: 5 }).map((_, index) => (
            <Text key={index} style={styles.warmTip}>
              {index + 1}. 溫馨提示溫馨提示溫馨提示溫馨提示溫馨提示
            </Text>
          ))}
        </View>

        {/* End Button */}
        <TouchableOpacity style={styles.endButton} onPress={handleEndGame}>
          <Text style={styles.endButtonText}>結束球局</Text>
        </TouchableOpacity>
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
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7043',
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 16,
  },
  timerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  timerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerColon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  warmTipsSection: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warmTipsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  warmTip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  endButton: {
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ContactScreen;
