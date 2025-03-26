import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select'; // Import picker select
import { MaterialIcons } from '@expo/vector-icons'; // For the eye icon
import Header from '@/component/Header';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/authSlice';
import { loginUser } from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = ({ route, navigation }: any) => {
  const { loginType } = route.params || { loginType: 'phone' };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [countryCode, setCountryCode] = useState('+886'); // Default country code
  const [inputValue, setInputValue] = useState('');
  const [password, setPassword] = useState('');
  const pickerRef = useRef<RNPickerSelect>(null);
  const dispatch = useDispatch();

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

  const handleLogin = async () => {
    if (!inputValue || !password) {
      Alert.alert('錯誤', '請輸入完整資訊');
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
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('登入失敗', response.message || '請檢查您的帳號密碼');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(`[Login] Error:`, error);
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
              <View style={styles.inputWrapper}>
                {loginType === 'phone' ? (
                  <>
                    <RNPickerSelect
                      value={countryCode || countryCodes[0].value}
                      onValueChange={(value) => {
                        if (value) setCountryCode(value);
                      }}
                      items={countryCodes}
                      style={{
                        inputIOS: styles.dropdownInput,
                        inputAndroid: styles.dropdownInput,
                        iconContainer: styles.iconContainer,
                      }} // 隱藏原本的輸入框
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: '請選擇', value: '' }}
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
                      value={inputValue}
                      onChangeText={setInputValue}
                    />
                  </>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入 Email"
                    keyboardType="email-address"
                    value={inputValue}
                    onChangeText={setInputValue}
                  />
                )}
              </View>
            </View>

            {/* Password Field */}
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
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>忘記密碼?</Text>
            </TouchableOpacity>

            {/* Login Button */}
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
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 10,
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
});

export default LoginScreen;
