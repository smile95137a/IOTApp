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
import RNPickerSelect from 'react-native-picker-select'; // Import picker select
import { MaterialIcons } from '@expo/vector-icons'; // For the eye icon

const LoginScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('信箱'); // Default tab is "信箱"
  const [countryCode, setCountryCode] = useState('+886'); // Default country code

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
        <Text style={styles.title}>登入</Text>
        <Text style={styles.subtitle}>選擇一個方式手機或信箱來進行登入</Text>

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
                      top: 10, // Adjust for vertical centering
                      right: 5, // Spacing from the edge
                    },
                  }}
                  useNativeAndroidPickerStyle={false} // Makes Android picker consistent
                  Icon={() => (
                    <MaterialIcons
                      name="arrow-drop-down"
                      size={24}
                      color="#888"
                      style={{ alignSelf: 'center' }} // Center alignment
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

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>密碼</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="請輸入密碼"
              secureTextEntry={!isPasswordVisible}
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

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>忘記密碼?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>登入</Text>
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
  dropdownInput: {
    fontSize: 14,
    color: '#000',
    width: 100, // Dropdown width
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: 'right',
    color: '#FFA76E',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#FFA76E',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
