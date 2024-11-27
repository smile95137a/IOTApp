import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons like phone or mail

const LoginHomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('手機');

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('@/assets/iot-threeBall.png')}
        style={styles.logo}
      />

      {/* Tabs: 信箱 | 手機 */}
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
        <Text style={styles.separator}>|</Text>
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

      {/* Login Button */}
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate(
            activeTab === '手機' ? 'LoginScreen' : 'RegisterScreen'
          )
        }
      >
        <MaterialIcons
          name={activeTab === '手機' ? 'phone-iphone' : 'mail-outline'}
          size={20}
          color="#F67943"
          style={styles.icon}
        />
        <View style={styles.primaryButtonTextContainer}>
          <Text style={styles.primaryButtonText}>
            使用{activeTab === '手機' ? '手機' : '信箱'}登入
          </Text>
        </View>
      </TouchableOpacity>

      {/* OR Separator */}
      <Text style={styles.orText}>OR</Text>

      {/* Social Login Buttons */}
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

      {/* Register Link */}
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        <Text style={styles.registerText}>註冊</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#F67943',
    borderRadius: 30,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  separator: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 20,
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
    marginBottom: 20,
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
  orText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
    objectFit: 'contain',
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
    marginBottom: 6,
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
});

export default LoginHomeScreen;
