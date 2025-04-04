import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Header from '@/component/Header'; // 假設你已有 Header component
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('錯誤', '請輸入 Email');
      return;
    }
    try {
      // 呼叫後端 API 發送重設密碼連結
      // 例如：await forgotPassword(email);
      Alert.alert('成功', '已發送重設密碼的連結到您的信箱');
      navigation.goBack();
    } catch (error) {
      Alert.alert('錯誤', '無法發送重設密碼請求');
    }
  };

  return (
    <LinearGradient
      colors={['#1D1640', '#4067A4']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.safeArea}>
          <Header
            onBackPress={() => navigation.goBack()}
            title="忘記密碼"
            isDarkMode
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Text style={styles.title}>重設密碼</Text>
            <Text style={styles.subtitle}>
              請輸入您註冊時使用的 Email，我們將發送重設密碼連結到您的信箱。
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="請輸入 Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => navigation.navigate('ResetPassword')}
            >
              <Text style={styles.resetButtonText}>發送重設密碼連結</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#00BFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFC702',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#00BFFF',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  resetButton: {
    backgroundColor: '#FFC702',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
