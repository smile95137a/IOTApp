import React, { useState } from 'react';
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
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { MaterialIcons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('信箱');
  const [countryCode, setCountryCode] = useState('+886');

  const handleNext = () => {
    // Add your navigation logic or action here
    navigation.navigate('PersonalInformationScreen'); // Example navigation to the next screen
  };

  const countryCodes = [
    { label: '+886', value: '+886' },
    { label: '+81', value: '+81' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>註冊</Text>
        <Text style={styles.subtitle}>選擇一個方式手機或信箱來進行註冊</Text>

        {/* Tab Selector */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === '信箱' && styles.activeTab]}
            onPress={() => setActiveTab('信箱')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === '信箱' && styles.activeTabText,
              ]}
            >
              信箱
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === '手機' && styles.activeTab]}
            onPress={() => setActiveTab('手機')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === '手機' && styles.activeTabText,
              ]}
            >
              手機
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        {activeTab === '信箱' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>信箱</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="請輸入信箱"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>手機</Text>
              <View style={styles.inputWrapper}>
                {/* Dropdown for country code */}
                <RNPickerSelect
                  value={countryCode}
                  onValueChange={(value) => setCountryCode(value)}
                  items={countryCodes}
                  style={{
                    inputIOS: {
                      height: 40,
                      fontSize: 14,
                      paddingHorizontal: 10,
                      color: '#000',
                      width: 100,
                    },
                    inputAndroid: {
                      height: 40,
                      fontSize: 14,
                      paddingHorizontal: 10,
                      color: '#000',
                      width: 100,
                    },
                    iconContainer: {
                      top: 10,
                      right: 5,
                    },
                  }}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#888"
                      style={{ alignSelf: 'center' }}
                    />
                  )}
                />
                <TextInput
                  style={styles.input}
                  placeholder="請輸入手機號碼"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </>
        )}

        {/* Verification Code Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>驗證碼</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="請輸入驗證碼"
              keyboardType="numeric"
            />
            <TouchableOpacity>
              <Text style={styles.resendText}>重新發送(60s)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>下一步</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
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
    color: '#555',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  resendText: {
    color: '#FFA76E',
    marginLeft: 10,
    fontSize: 12,
  },
  nextButton: {
    backgroundColor: '#FFA76E',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
