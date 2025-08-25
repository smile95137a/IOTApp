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
import { fetchUserInfo } from '../../api/userApi';
import NumberFormatter from '../../component/NumberFormatter';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch } from '../../store/store';
import { setUser } from '../../store/userSlice';
import { getErrorMessage } from '../../utils/errorUtils';
import { logJson } from '../../utils/logJsonUtils';
import { useDialog } from '../../context/DialogContext';

const PaymentSuccessScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog } = useDialog();

  const route = useRoute<any>();
  const { type, totalAmount, showStartGame, data } = route.params || {};

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          dispatch(showLoading());
          const res = await fetchUserInfo();
          dispatch(hideLoading());

          if (res.success) {
            dispatch(setUser(res.data));
          } else {
            console.warn('[User Info] Fetch failed:', res.message);
          }
        } catch (error: any) {
          if (error.isAutoLogout) return;
          dispatch(hideLoading());
          await openInfoDialog({
            title: '錯誤',
            content: getErrorMessage(error),
          });
        }
      })();
    }, [dispatch, openInfoDialog])
  );

  const handleStartGame = () => {
    logJson('transaction', data);
    navigation.navigate('Contact', {
      transaction: {
        ...data.gameRecord,
        storePhone: data.storePhone,
        timeSlots: data.timeSlots,
      },
    });
  };

  const handleGoHome = () => navigation.navigate('Home');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.successText}>付費成功！</Text>
        <View style={styles.divider} />
        <Text style={styles.totalAmount}>
          <Text style={styles.totalAmountLabel}>總金額：</Text>
          $<NumberFormatter number={totalAmount} /> 元
        </Text>
      </View>

      {showStartGame && (
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleStartGame}
        >
          <Text style={styles.primaryText}>前往球局</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
        <Text style={styles.secondaryText}>完成</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  messageContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  totalAmount: {
    fontSize: 20,
    color: '#C8545F',
    fontWeight: 'bold',
  },
  totalAmountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'normal',
  },
  primaryButton: {
    backgroundColor: '#FFC702',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginBottom: 40,
  },
  primaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  secondaryButton: {
    backgroundColor: '#CFCFCF',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 12,
    marginBottom: 20,
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default PaymentSuccessScreen;
