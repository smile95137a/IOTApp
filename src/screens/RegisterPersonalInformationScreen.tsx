import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../api/authApi';
import { registerUser, uploadProfileImage } from '../api/userApi';
import { useDialog } from '../context/DialogContext';
import { setAuth } from '../store/authSlice';
import { showLoading, hideLoading } from '../store/loadingSlice';
import { RootState } from '../store/store';
import { getErrorMessage } from '../utils/errorUtils';
import Header from '../component/Header';

const RegisterPersonalInformationScreen = ({ route, navigation }: any) => {
  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ];

  const dispatch = useDispatch();
  const pickerRef = useRef<RNPickerSelect>(null);
  const { phone, countryCode, verificationCode } = useSelector(
    (state: RootState) => state.register
  );

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [anonymousId, setAnonymousId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { openInfoDialog } = useDialog();

  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相簿權限',
        confirmText: '我知道了',
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        isCircle: true,
        from: {
          tab: 'Auth',
          stack: 'PersonalInfo',
        },
      });
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相機權限',
        confirmText: '我知道了',
      });
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      (navigation as any).navigate('CropImage', {
        uri: result.assets[0].uri,
        aspectRatio: [1, 1],
        isCircle: true,
        from: {
          tab: 'Auth',
          stack: 'PersonalInfo',
        },
      });
    }
  };

  const resetAndNavigateToMain = () => {
    (navigation as any).reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  const handleNextStep = async () => {
    if (!name || !gender || !password || !confirmPassword) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫所有必填欄位',
        confirmText: '我知道了',
      });
      return;
    }

    if (password !== confirmPassword) {
      await openInfoDialog({
        title: '錯誤',
        content: '密碼與確認密碼不一致',
        confirmText: '我知道了',
      });
      return;
    }

    const userData = {
      name,
      password,
      gender,
      anonymousId,
      email,
      phone,
      countryCode,
      verificationCode,
    };

    try {
      dispatch(showLoading());

      const { success, data, message } = await registerUser(userData);

      if (!success) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: message || '註冊失敗，請重試',
          confirmText: '我知道了',
        });
        return;
      }

      const userId = data.id;

      if (profileImage) {
        const uploadSuccess = await uploadProfileImage(userId, profileImage);
        if (!uploadSuccess) {
          await openInfoDialog({
            title: '錯誤',
            content: '頭像上傳失敗，請稍後重試',
            confirmText: '我知道了',
          });
        }
      }

      const loginResult = await loginUser({ type: 'email', email, password });

      if (!loginResult.success) {
        console.warn('[Login] 登入失敗:', loginResult.message);
        await openInfoDialog({
          title: '登入失敗',
          content: '帳號已建立，請手動登入',
          confirmText: '我知道了',
        });
        return;
      }
      console.log('[Login] 登入成功:', loginResult.data.user);
      const { accessToken, user } = loginResult.data;
      dispatch(setAuth({ token: accessToken, user }));
      await openInfoDialog({
        title: '註冊成功',
        content: '歡迎加入！',
        confirmText: '進入首頁',
      });

      (navigation as any).reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

      dispatch(hideLoading());
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    const croppedImageUri = route.params?.croppedImageUri;
    if (croppedImageUri) {
      setProfileImage(croppedImageUri);
    }
  }, [route.params?.croppedImageUri]);

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

            <Text style={styles.title}>個人資料</Text>
            <ScrollView>
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
              {/* 姓名 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>姓名 *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入真實姓名"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
              {/* 密碼 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>密碼 *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入密碼"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              {/* 再次確認密碼 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>再次確認密碼 *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="請再次輸入密碼"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={true}
                  />
                </View>
              </View>

              {/* 暱稱 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>暱稱</Text>
                <View
                  style={[styles.inputWrapper, styles.disabledInputWrapper]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder="請輸入暱稱"
                    value={anonymousId}
                    onChangeText={setAnonymousId}
                  />
                </View>
              </View>

              {/* 性別選擇 */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>性別 *</Text>
                <View style={styles.pickerWrapper}>
                  <>
                    <RNPickerSelect
                      value={gender}
                      onValueChange={(value) => setGender(value)}
                      items={genderOptions}
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
                      useNativeAndroidPickerStyle={false}
                      placeholder={{ label: '請選擇', value: '' }}
                    />
                  </>
                </View>
              </View>

              {/* 上傳頭像照片 */}
              <View style={styles.uploadContainer}>
                <Text style={styles.inputLabel}>上傳頭像照片</Text>
                <View style={styles.uploadWrapper}>
                  {profileImage && (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  )}
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUploadPhoto}
                  >
                    <MaterialIcons
                      name="file-upload"
                      size={30}
                      color="#666666"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleTakePhoto}
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={30}
                      color="#666666"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            {/* 底部按鈕 */}
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#00BFFF',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#00BFFF',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  disabledText: {
    color: '#888',
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#FFF',
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  picker: {
    fontSize: 14,
    color: '#000',
  },
  uploadContainer: {
    marginTop: 20,
  },
  uploadWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFF',
    position: 'relative',
    aspectRatio: 1,
  },
  uploadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    zIndex: 2,
  },
  profileImage: {
    position: 'absolute', // 讓圖片絕對定位在父容器內
    left: 0,
    inset: 0,
    zIndex: 1, // 確保圖片在最上層
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
  },
  disabledInputWrapper: {
    backgroundColor: '#f0f0f0', // 淺灰背景
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
});

export default RegisterPersonalInformationScreen;
