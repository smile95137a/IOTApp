import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LoginHomeScreen = ({ navigation }: any) => {
  const resetAndNavigateToMain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require('@/assets/iot-login-logo.png')}
          style={styles.logo}
        />

        {/* Primary Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login', { loginType: 'phone' })}
          >
            <MaterialIcons
              name={'phone-iphone'}
              size={20}
              color="#E55D87"
              style={styles.icon}
            />
            <View style={styles.primaryButtonTextContainer}>
              <Text style={styles.primaryButtonText}>使用手機登入</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login', { loginType: 'email' })}
          >
            <MaterialIcons
              name={'mail-outline'}
              size={20}
              color="#E55D87"
              style={styles.icon}
            />
            <View style={styles.primaryButtonTextContainer}>
              <Text style={styles.primaryButtonText}>使用Email登入</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>快速登入</Text>
          <View style={styles.line} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonGroup}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('@/assets/iot-google.png')}
              style={styles.socialIcon}
            />
            <View style={styles.socialButtonTextContainer}>
              <Text style={styles.socialButtonText}>使用 Google 登入</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('@/assets/iot-apple.png')}
              style={styles.socialIcon}
            />
            <View style={styles.socialButtonTextContainer}>
              <Text style={styles.socialButtonText}>使用 Apple ID 登入</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('@/assets/iot-fb.png')}
              style={styles.socialIcon}
            />
            <View style={styles.socialButtonTextContainer}>
              <Text style={styles.socialButtonText}>使用 Facebook 登入</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>註冊</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={resetAndNavigateToMain}
        >
          <MaterialIcons name="home" size={24} color="#000" />
          <Text style={styles.homeButtonText}>回首頁</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
  },
  logo: {
    width: 169,
    height: 163,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonGroup: {
    width: '100%',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 12, // Add gap between buttons
  },
  primaryButtonTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
  },
  icon: {
    width: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6E6E6',
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 15,
    color: '#949494',
  },
  socialButtonGroup: {
    width: '100%',
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    marginBottom: 12, // Add gap between social buttons
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  socialButtonTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 14,
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#FF0000',
    fontSize: 16,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    bottom: 20,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 50,
  },
  homeButtonText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 6,
  },
});

export default LoginHomeScreen;
