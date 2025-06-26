import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../api/authApi';
import { useDialog } from '../context/DialogContext';
import { setAuth } from '../store/authSlice';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { getErrorMessage } from '../utils/errorUtils';
import Header from '../component/Header';
import { MyDropdown } from '../component/MyDropdown';

const LoginScreen = ({ route, navigation }: any) => {
  const { loginType } = route.params || { loginType: 'phone' };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+886');
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const pickerRef = useRef(null);
  const dispatch = useDispatch();
  const { openInfoDialog } = useDialog();

  const countryCodes = [
    { label: '+886', value: '+886' },
    { label: '+81', value: '+81' },
  ];

  const resetAndNavigateToMain = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const handleLogin = async () => {
    if (!inputValue || !password) {
      await openInfoDialog({ title: '錯誤', content: '請輸入完整資訊' });
      return;
    }

    const loginData =
      loginType === 'phone'
        ? { type: 'phone', countryCode, phone: inputValue, password }
        : { type: 'email', email: inputValue, password };

    try {
      dispatch(showLoading());
      const response = await loginUser(loginData);
      dispatch(hideLoading());
      if (response.success) {
        const { accessToken, user } = response.data;
        dispatch(setAuth({ token: accessToken, user }));
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        await openInfoDialog({
          title: '登入失敗',
          content: response.message || '請檢查您的帳號密碼',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({ title: '錯誤', content: getErrorMessage(error) });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <LinearGradient
          colors={['#1D1640', '#4067A4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.container}>
            <Header onBackPress={() => navigation.goBack()} isDarkMode />

            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.containerOS}
            >
              <Text style={styles.title}>登入</Text>
              <Text style={styles.subtitle}>
                {loginType === 'phone'
                  ? '請輸入您的手機號碼'
                  : '請輸入您的 Email'}
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {loginType === 'phone' ? '手機' : 'Email'}
                </Text>
                {loginType === 'phone' ? (
                  <View style={styles.phoneInputWrapper}>
                    <View style={styles.countryCodeWrapper}>
                      <MyDropdown
                        value={countryCode}
                        onChange={setCountryCode}
                        items={countryCodes}
                        zIndex={3000}
                      />
                    </View>
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="請輸入手機號碼"
                      keyboardType="phone-pad"
                      value={inputValue}
                      onChangeText={setInputValue}
                    />
                  </View>
                ) : (
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="請輸入 Email"
                      keyboardType="email-address"
                      value={inputValue}
                      onChangeText={setInputValue}
                    />
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>密碼</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入密碼"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    <MaterialIcons
                      name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                      size={24}
                      color="#ccc"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>忘記密碼?</Text>
                <MaterialIcons
                  name="send"
                  size={16}
                  color={'#007BFF'}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>

              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={resetAndNavigateToMain}
                >
                  <MaterialIcons name="home" size={18} color="#000" />
                  <Text style={styles.homeButtonText}>回首頁</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>登入</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  gradient: { flex: 1, paddingBottom: 16 },
  container: { flex: 1, paddingHorizontal: 16 },
  containerOS: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#00BFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#FFC702',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, marginBottom: 8, color: '#00BFFF' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 10,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 10,
  },
  countryCodeWrapper: {
    flex: 3,
    height: 50,
    justifyContent: 'center',
    paddingRight: 6,
  },
  phoneInput: { flex: 7, height: 50, fontSize: 14, paddingHorizontal: 10 },
  input: { flex: 1, height: 50, fontSize: 14, paddingHorizontal: 10 },
  forgotPasswordText: { textAlign: 'center', color: '#007BFF' },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#3C3C435C',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#FFF',
  },
  homeButtonText: { fontSize: 14, marginLeft: 5 },
  loginButton: {
    backgroundColor: '#FFC702',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  loginButtonText: { fontSize: 16 },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#007BFF',
    alignSelf: 'center',
    marginBottom: 20,
  },
  sendIcon: { marginLeft: 5 },
});

export default LoginScreen;
