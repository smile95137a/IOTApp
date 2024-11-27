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
import DatePicker from 'react-native-date-picker'; // Import Date Picker

const PersonalInformationScreen = () => {
  const [gender, setGender] = useState(null);
  const [birthday, setBirthday] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false); // Control visibility of the date picker

  const genders = [
    { label: '男', value: '男' },
    { label: '女', value: '女' },
    { label: '其他', value: '其他' },
  ];

  const handleNext = () => {
    console.log('Gender:', gender, 'Birthday:', birthday);
  };

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
        <Text style={styles.title}>個人資料</Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>姓名</Text>
          <TextInput style={styles.input} placeholder="請輸入真實姓名" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>性別</Text>
          <RNPickerSelect
            value={gender}
            onValueChange={(value) => setGender(value)}
            items={genders}
            style={{
              inputIOS: {
                height: 40,
                fontSize: 14,
                paddingHorizontal: 10,
                color: '#000',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 5,
              },
              inputAndroid: {
                height: 40,
                fontSize: 14,
                paddingHorizontal: 10,
                color: '#000',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 5,
              },
              iconContainer: {
                top: 12,
                right: 12,
              },
            }}
            placeholder={{ label: '請選擇性別', value: null }}
            Icon={() => <Text style={styles.pickerIcon}>▼</Text>}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>生日</Text>
          <TouchableOpacity
            style={styles.dateInputWrapper}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Text style={styles.dateText}>
              {birthday.toISOString().split('T')[0]}{' '}
              {/* Display selected date */}
            </Text>
          </TouchableOpacity>
          {isDatePickerVisible && (
            <DatePicker
              modal
              mode="date"
              open={isDatePickerVisible}
              date={birthday}
              onConfirm={(date) => {
                setBirthday(date);
                setIsDatePickerVisible(false);
              }}
              onCancel={() => {
                setIsDatePickerVisible(false);
              }}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>手機號碼</Text>
          <TextInput
            style={styles.input}
            placeholder="請輸入手機號碼"
            keyboardType="phone-pad"
          />
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
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  dateInputWrapper: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  dateText: {
    fontSize: 14,
    color: '#000',
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
  pickerIcon: {
    fontSize: 18,
    color: '#888',
  },
});

export default PersonalInformationScreen;
