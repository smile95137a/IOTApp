import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/component/Header';
import { resetPassword } from '@/api/authApi'; // 連接後端 API
import { LinearGradient } from 'expo-linear-gradient';

const ResetPasswordScreen = ({ navigation }: any) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleResetPassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('錯誤', '請輸入完整資訊');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('錯誤', '新密碼與確認密碼不匹配');
      return;
    }

    try {
      const response = await resetPassword({
        oldPassword,
        newPassword,
      });

      if (response.success) {
        Alert.alert('成功', '您的密碼已更新，請使用新密碼登入');
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        Alert.alert('錯誤', response.message || '請檢查您的舊密碼');
      }
    } catch (error) {
      console.error(`[ResetPassword] Error:`, error);
      Alert.alert('錯誤', '無法連線到伺服器');
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
          <Header onBackPress={() => navigation.goBack()} isDarkMode />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Text style={styles.title}>重設密碼</Text>

            {/* 舊密碼 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>舊密碼</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="輸入舊密碼"
                  secureTextEntry={!isOldPasswordVisible}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
                <TouchableOpacity
                  onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
                >
                  <MaterialIcons
                    name={
                      isOldPasswordVisible ? 'visibility' : 'visibility-off'
                    }
                    size={24}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 新密碼 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>新密碼</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="輸入新密碼"
                  secureTextEntry={!isNewPasswordVisible}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                >
                  <MaterialIcons
                    name={
                      isNewPasswordVisible ? 'visibility' : 'visibility-off'
                    }
                    size={24}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 確認新密碼 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>確認新密碼</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="請再次輸入新密碼"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                >
                  <MaterialIcons
                    name={
                      isConfirmPasswordVisible ? 'visibility' : 'visibility-off'
                    }
                    size={24}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 提交按鈕 */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPassword}
            >
              <Text style={styles.buttonText}>重設密碼</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#00BFFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#00BFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#F7F7F7',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FFC702',
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});

export default ResetPasswordScreen;
