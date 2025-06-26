import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { setRegisterData } from '../store/registerSlice';
import Header from '../component/Header';
import { MyDropdown } from '../component/MyDropdown';

const RegisterScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countryCode, setCountryCode] = useState('+886');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(0);

  const handleSendCode = () => {
    setIsCodeSent(true);
    setTimer(60);
  };

  const handleResendCode = () => {
    if (timer === 0) {
      handleSendCode();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsCodeSent(false);
    }
  }, [timer]);

  const countryCodes = [
    { label: '+886', value: '+886' },
    { label: '+81', value: '+81' },
  ];

  const resetAndNavigateToMain = () => {
    (navigation as any).reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  const handleNextStep = () => {
    dispatch(
      setRegisterData({
        phone,
        countryCode,
        verificationCode,
      })
    );

    (navigation as any).navigate('PersonalInfo');
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
            <Header
              onBackPress={() => (navigation as any).goBack()}
              isDarkMode
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.containerOS}
            >
              <Text style={styles.title}>註冊</Text>
              <Text style={styles.subtitle}>
                請輸入行動電話號碼進行實名認證。
              </Text>

              {/* Email Field */}

              {/* Phone Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>手機</Text>
                <View style={styles.phoneInputWrapper}>
                  <View style={styles.countryCodeWrapper}>
                    <MyDropdown
                      value={countryCode}
                      onChange={(value) => {
                        if (value) setCountryCode(value);
                      }}
                      items={countryCodes}
                      zIndex={3000}
                    />
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="請輸入手機號碼"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
              </View>

              {/* Verification Code Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>驗證碼</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入驗證碼"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    isCodeSent ? styles.disabledButton : null,
                  ]}
                  onPress={isCodeSent ? handleResendCode : handleSendCode}
                  disabled={timer > 0}
                >
                  <MaterialIcons
                    name="send"
                    size={16}
                    color={timer > 0 ? '#aaa' : '#007BFF'}
                    style={styles.sendIcon}
                  />
                  <Text
                    style={[
                      styles.sendButtonText,
                      timer > 0 && styles.disabledText,
                    ]}
                  >
                    {isCodeSent ? `重寄驗證碼 (${timer}s)` : '發送驗證碼'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Buttons */}
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
                  onPress={handleNextStep}
                >
                  <Text style={styles.loginButtonText}>下一步</Text>
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
  safeArea: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  containerOS: { flex: 1 },
  logoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '50%',
  },
  activeTab: {
    borderWidth: 2,
    borderColor: '#FFA76E',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#F67943',
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
  dropdownInput: {
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: 100,
    alignItems: 'center',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },

  input: {
    flex: 1,
    height: 50,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#E21A1C',
  },
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
  homeButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#FFC702',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 16,
  },
  resendText: {
    textAlign: 'center',
    color: '#FF0000',
    marginTop: 10,
  },
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
  sendIcon: {
    marginLeft: 5,
  },
  sendButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: '#e0e0e0',
    borderColor: '#aaa',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  disabledText: {
    color: '#aaa', // 文字變灰
  },
  formGroup: {
    marginBottom: 32,
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
});

export default RegisterScreen;
