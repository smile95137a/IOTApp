import React, { useRef, useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '@/component/Header';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { genRandomNumbers } from '@/utils/RandomUtils';
import { registerUser, uploadProfileImage } from '@/api/userApi';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { loginUser } from '@/api/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuth } from '@/store/authSlice';

const PersonalInfoScreen = ({ route, navigation }: any) => {
  const genderOptions = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '其他', value: 'other' },
  ];

  const dispatch = useDispatch();
  const pickerRef = useRef<RNPickerSelect>(null);
  const { email, phone, countryCode, verificationCode } = useSelector(
    (state: RootState) => state.register
  );

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [anonymousId] = useState(genRandomNumbers(20));
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const selectedGenderLabel =
    genderOptions.find((option) => option.value === gender)?.label || '請選擇';

  // 選擇相簿照片
  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相簿權限');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // 拍照
  const handleTakePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('權限不足', '請允許存取相機權限');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const resetAndNavigateToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };
  const handleNextStep = async () => {
    if (!name || !gender || !password) {
      Alert.alert('錯誤', '請填寫所有必填欄位');
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
        Alert.alert('錯誤', message || '註冊失敗，請重試');
        return;
      }

      console.log('[Register] 註冊成功:', data);
      const userId = data.id;

      if (profileImage) {
        console.log('[Upload] 開始上傳頭像...');
        const uploadSuccess = await uploadProfileImage(userId, profileImage);
        if (!uploadSuccess) {
          console.warn('[Upload] 頭像上傳失敗');
          Alert.alert('錯誤', '頭像上傳失敗，請稍後重試');
        } else {
          console.log('[Upload] 頭像上傳成功');
        }
      }

      console.log('[Login] 嘗試自動登入...');
      const loginResult = await loginUser({ type: 'email', email, password });

      if (loginResult.success) {
        console.log('[Login] 自動登入成功:', loginResult.data.user);
        Alert.alert('成功', '註冊並登入成功');
        const { accessToken, user } = loginResult.data;
        dispatch(setAuth({ token: accessToken, user }));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        console.warn('[Login] 自動登入失敗:', loginResult.message);
        Alert.alert('錯誤', '自動登入失敗，請手動登入');
      }

      dispatch(hideLoading());
    } catch (error) {
      dispatch(hideLoading());
      console.error('[Error]', error);
      Alert.alert('錯誤', '發生未知錯誤，請稍後再試');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header
            onBackPress={() => navigation.goBack()}
            rightIcon="more-vert"
          />
          <Text style={styles.title}>個人資料</Text>

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

          {/* 匿名 ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>匿名 ID *</Text>
            <View style={[styles.inputWrapper, styles.disabledInputWrapper]}>
              <TextInput
                style={styles.input}
                placeholder="請輸入真實姓名"
                value={anonymousId}
                editable={false}
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
                <MaterialIcons name="file-upload" size={30} color="#666666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleTakePhoto}
              >
                <MaterialIcons name="camera-alt" size={30} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingBottom: 16,
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
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
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
    height: 200,
    position: 'relative',
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
  },
  homeButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: '#F67943',
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  loginButtonText: {
    fontSize: 16,
    color: '#FFF',
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

export default PersonalInfoScreen;
