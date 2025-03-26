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
import RNPickerSelect from 'react-native-picker-select'; // Import picker select
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import Header from '@/component/Header';
import { useDispatch } from 'react-redux';
import { setRegisterData } from '@/store/registerSlice';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();

  const pickerRef = useRef<RNPickerSelect>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+886');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [timer, setTimer] = useState(0);

  const handleSendCode = () => {
    setIsCodeSent(true);
    setTimer(60); // Set countdown to 60 seconds
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
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  const handleNextStep = () => {
    dispatch(
      setRegisterData({
        email,
        phone,
        countryCode,
        verificationCode,
      })
    );

    navigation.navigate('PersonalInfo');
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
            rightIcon="more-vert"
            onRightPress={() => console.log('More options pressed')}
            isDarkMode
          />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
          >
            <Text style={styles.title}>註冊</Text>
            <Text style={styles.subtitle}>
              選擇一個方式手機或信箱來進行註冊
            </Text>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>電子信箱</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="請輸入電子信箱"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Phone Field */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>手機</Text>
              <View style={styles.inputWrapper}>
                <>
                  <RNPickerSelect
                    value={countryCode}
                    onValueChange={(value) => {
                      if (value) setCountryCode(value);
                    }}
                    items={countryCodes}
                    placeholder={{ label: '請選擇', value: '' }}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    Icon={() => (
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color="#888"
                      />
                    )}
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="請輸入手機號碼"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </>
              </View>
            </View>

            {/* Send Code Button */}
            <View>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  isCodeSent ? styles.disabledButton : null,
                ]}
                onPress={handleSendCode}
                disabled={isCodeSent}
              >
                <Text
                  style={[
                    styles.sendButtonText,
                    timer > 0 ? styles.disabledText : null, // 文字變灰
                  ]}
                >
                  {isCodeSent ? `等待重新發送驗證碼` : '發送驗證碼'}
                </Text>
                <MaterialIcons
                  name="send"
                  size={16}
                  color={isCodeSent ? '#aaa' : '#007BFF'}
                  style={styles.sendIcon}
                />
              </TouchableOpacity>
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

            <TouchableOpacity onPress={handleResendCode} disabled={timer > 0}>
              <Text style={styles.resendText}>沒收到驗證信?重寄({timer}S)</Text>
            </TouchableOpacity>

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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
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
    height: 40,
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
});

export default RegisterScreen;
