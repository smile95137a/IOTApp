import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddPromotionScreen = ({ route }) => {
  const [promotionName, setPromotionName] = useState('');
  const [promotionAmount, setPromotionAmount] = useState('');
  const [actualCharge, setActualCharge] = useState('');
  const promotion = route.params?.promotion;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Text style={styles.backButton}>{'< 返回'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>優惠方案設定</Text>
          <Icon name="dots-vertical" size={24} color="#616161" />
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            style={styles.image}
          />
          <TouchableOpacity style={styles.cameraIcon}>
            <Icon name="camera" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>名稱：</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入優惠名稱"
              value={promotionName}
              onChangeText={setPromotionName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>儲值額度：</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入儲值金額"
              value={promotionAmount}
              onChangeText={setPromotionAmount}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>實收費用：</Text>
            <TextInput
              style={styles.input}
              placeholder="輸入實收金額"
              value={actualCharge}
              onChangeText={setActualCharge}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>儲存</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#E3F2FD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: '40%',
    backgroundColor: '#FF7043',
    padding: 10,
    borderRadius: 20,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    color: '#616161',
  },
  saveButton: {
    backgroundColor: '#FF7043',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddPromotionScreen;
