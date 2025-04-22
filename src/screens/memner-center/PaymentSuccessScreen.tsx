import { fetchUserInfo } from '@/api/userApi';
import NumberFormatter from '@/component/NumberFormatter';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { setUser } from '@/store/userSlice';
import { logJson } from '@/utils/logJsonUtils';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';

const PaymentSuccessScreen = ({ navigation }) => {
  const route = useRoute();
  const { type, totalAmount, showStartGame, data } = route.params || {};
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      const getUserInfo = async () => {
        try {
          dispatch(showLoading());
          const response = await fetchUserInfo();
          dispatch(hideLoading());

          if (response.success) {
            console.log('[User Info] API Response:', response.data);
            dispatch(setUser(response.data));
          } else {
            console.warn('[User Info] Fetch failed:', response.message);
          }
        } catch (error) {
          if (error.isAutoLogout) return;
          dispatch(hideLoading());

          console.log('[User Info] Fetch error:', error);
        }
      };

      getUserInfo();
    }, [])
  );
  const handleStartGame = () => {
    navigation.navigate('Contact', { transaction: data.gameRecord });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.successText}>付費成功！</Text>
        <View style={styles.divider} />
        <Text style={styles.totalAmount}>
          <Text style={styles.totalAmountLabel}>總金額：</Text>
          <Text>
            $<NumberFormatter number={~~totalAmount} /> 元
          </Text>
        </Text>
      </View>

      {showStartGame && (
        <TouchableOpacity
          style={styles.startGameButton}
          onPress={handleStartGame}
        >
          <Text style={styles.startGameText}>開始球局</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  messageContainer: {
    alignItems: 'center',
    width: '100%',
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  divider: {
    width: '100%',
    height: 2, // 增加高度以確保可見性
    backgroundColor: '#000', // 水平線的顏色
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 20,
    color: '#C8545F', // 紅色文字
    fontWeight: 'bold',
    marginTop: 8,
  },
  totalAmountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal', // 總金額標籤使用一般字體
  },
  startGameButton: {
    backgroundColor: '#FFC702',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginBottom: 40,
  },
  startGameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PaymentSuccessScreen;
