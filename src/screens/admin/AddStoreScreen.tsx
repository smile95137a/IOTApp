import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  Keyboard,
  SafeAreaView,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import {
  createStore,
  updateStore,
  uploadStoreImages,
} from '@/api/admin/storeApi';
import { fetchAllVendors } from '@/api/admin/vendorApi';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import HeaderBar from '@/component/admin/HeaderBar';
import { logJson } from '@/utils/logJsonUtils';
import { getImageUrl } from '@/utils/ImageUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const AddStoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();

  const store = route.params?.store || null;
  const isEditMode = !!store;

  const [name, setName] = useState(store?.name || '');
  const [address, setAddress] = useState(store?.address || '');
  const [vendorId, setVendorId] = useState(
    store?.vendor?.id ? String(store.vendor.id) : ''
  );
  const [lat, setLat] = useState(store?.lat ? String(store.lat) : '');
  const [lon, setLon] = useState(store?.lon ? String(store.lon) : '');
  const [deposit, setDeposit] = useState(
    store?.deposit ? String(store.deposit) : ''
  );
  const [discountRate, setDiscountRate] = useState(
    store?.discountRate ? String(store.discountRate) : ''
  );
  const [regularRate, setRegularRate] = useState(
    store?.regularRate ? String(store.regularRate) : ''
  );

  const [hint, setHint] = useState(store?.hint ? String(store.hint) : '');
  const [contactPhone, setContactPhone] = useState(
    store?.contactPhone ? String(store.contactPhone) : ''
  );

  const [vendors, setVendors] = useState([]);
  const [image, setImage] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(store ? { latitude: store.lat, longitude: store.lon } : null);

  const [pricingSchedules, setPricingSchedules] = useState(
    weekDays.map((day) => {
      const existingSchedule = store?.pricingSchedules?.find(
        (schedule) => schedule.dayOfWeek.toLowerCase() === day
      );

      return {
        dayOfWeek: day.toUpperCase(),
        openTime: existingSchedule?.openTime || '10:00',
        closeTime: existingSchedule?.closeTime || '23:00',
        regularRate: existingSchedule?.regularRate
          ? String(existingSchedule.regularRate)
          : '100',
        discountRate: existingSchedule?.discountRate
          ? String(existingSchedule.discountRate)
          : '100',
        timeSlots: existingSchedule?.timeSlots || [
          {
            startTime: '18:00',
            endTime: '21:00',
            isDiscount: true,
          },
        ],
      };
    })
  );

  useEffect(() => {
    const loadVendors = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchAllVendors();
        dispatch(hideLoading());

        if (response.success) {
          setVendors(response.data);
        } else {
          Alert.alert('錯誤', '無法獲取供應商列表');
        }
      } catch (error) {
        dispatch(hideLoading());
        Alert.alert('錯誤', '獲取供應商失敗');
      }
    };

    loadVendors();
  }, []);

  const updateSchedule = (dayIndex, key, value) => {
    const updatedSchedules = [...pricingSchedules];
    updatedSchedules[dayIndex][key] = value;
    setPricingSchedules(updatedSchedules);
  };

  const updateTimeSlot = (dayIndex, slotIndex, key, value) => {
    const updatedSchedules = [...pricingSchedules];
    updatedSchedules[dayIndex].timeSlots[slotIndex][key] = value;
    setPricingSchedules(updatedSchedules);
  };

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !vendorId.trim() ||
      !lat.trim() ||
      !lon.trim()
    ) {
      Alert.alert('錯誤', '請填寫完整資訊');
      return;
    }

    const storeData = {
      name,
      address,
      hint,
      contactPhone,
      vendor: { id: parseInt(vendorId) },
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      deposit: parseFloat(deposit) || 0,
      discountRate: parseFloat(discountRate) || 0,
      regularRate: parseFloat(regularRate) || 0,
      pricingSchedules: pricingSchedules.map((schedule) => ({
        ...schedule,
        regularRate: parseFloat(schedule.regularRate) || 0,
        discountRate: parseFloat(schedule.discountRate) || 0,
        timeSlots: schedule.timeSlots.map((slot) => ({
          ...slot,
        })),
      })),
    };
    logJson('Store Data', storeData);
    try {
      dispatch(showLoading());

      let response;

      if (isEditMode) {
        response = await updateStore(store.uid, storeData);
      } else {
        response = await createStore(storeData);
      }
      const savedNewsId = response.data?.id;
      if (image && savedNewsId) {
        await uploadStoreImages(savedNewsId, image);
      }

      dispatch(hideLoading());

      if (response.success) {
        Alert.alert('成功', isEditMode ? '店家資訊更新成功' : '店家新增成功', [
          { text: '確定', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('錯誤', response.message || '操作失敗');
      }
    } catch (error) {
      dispatch(hideLoading());
      Alert.alert('錯誤', '發生錯誤，請稍後再試');
    }
  };

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
      setImage(result.assets[0].uri);
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
      setImage(result.assets[0].uri);
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    Alert.alert(
      '確認選擇',
      `你選擇的位置：\n緯度: ${latitude}\n經度: ${longitude}`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '確定',
          onPress: () => {
            setSelectedLocation({ latitude, longitude });
            setLat(String(latitude));
            setLon(String(longitude));
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.backgroundImageWrapper}>
            <Image
              source={require('@/assets/iot-admin-bg.png')}
              style={{ width: '100%' }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.headerWrapper}>
            <HeaderBar title={isEditMode ? '編輯店家' : '新增店家'} />
          </View>
          <ScrollView style={styles.contentWrapper}>
            <ScrollView contentContainerStyle={styles.container}>
              <Text style={styles.header}>
                {isEditMode ? '編輯店家' : '新增店家'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="店家名稱"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="地址"
                value={address}
                onChangeText={setAddress}
              />

              <Picker
                selectedValue={vendorId}
                onValueChange={setVendorId}
                style={styles.picker}
              >
                <Picker.Item label="請選擇供應商" value="" />
                {vendors.map((vendor) => (
                  <Picker.Item
                    key={vendor.id}
                    label={vendor.name}
                    value={String(vendor.id)}
                  />
                ))}
              </Picker>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_DEFAULT}
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedLocation?.latitude ?? 25.033964,
                    longitude: selectedLocation?.longitude ?? 121.564468,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={handleMapPress}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
              </View>
              <TextInput
                style={styles.input}
                placeholder="緯度 (Lat)"
                keyboardType="numeric"
                value={lat}
                onChangeText={setLat}
                readOnly={true}
              />
              <TextInput
                style={styles.input}
                placeholder="經度 (Lon)"
                keyboardType="numeric"
                value={lon}
                onChangeText={setLon}
                readOnly={true}
              />
              <TextInput
                style={styles.input}
                placeholder="保證金 (可選)"
                keyboardType="numeric"
                value={deposit}
                onChangeText={setDeposit}
              />
              <TextInput
                style={styles.input}
                placeholder="溫馨提示"
                value={hint}
                onChangeText={setHint}
                multiline
              />
              <TextInput
                style={styles.input}
                placeholder="電話"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
              {pricingSchedules.map((schedule, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {schedule.dayOfWeek}
                  </Text>

                  <Text>營業開始時間</Text>
                  <TextInput
                    value={schedule.openTime}
                    onChangeText={(text) =>
                      updateSchedule(index, 'openTime', text)
                    }
                    placeholder="開放時間"
                    style={styles.input}
                  />

                  <Text>營業結束時間</Text>
                  <TextInput
                    value={schedule.closeTime}
                    onChangeText={(text) =>
                      updateSchedule(index, 'closeTime', text)
                    }
                    placeholder="結束時間"
                    style={styles.input}
                  />

                  <Text>一般費率</Text>
                  <TextInput
                    value={schedule.regularRate}
                    onChangeText={(text) =>
                      updateSchedule(index, 'regularRate', text)
                    }
                    placeholder="一般費率"
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <Text>折扣費率</Text>
                  <TextInput
                    value={schedule.discountRate}
                    onChangeText={(text) =>
                      updateSchedule(index, 'discountRate', text)
                    }
                    placeholder="折扣費率"
                    keyboardType="numeric"
                    style={styles.input}
                  />

                  <Text style={{ marginTop: 8 }}>折扣時段</Text>
                  {schedule.timeSlots.map((slot, slotIndex) => (
                    <View key={slotIndex} style={{ marginTop: 8 }}>
                      <Text>折扣開始</Text>
                      <TextInput
                        value={slot.startTime}
                        onChangeText={(text) =>
                          updateTimeSlot(index, slotIndex, 'startTime', text)
                        }
                        placeholder="折扣開始"
                        style={styles.input}
                      />

                      <Text>折扣結束</Text>
                      <TextInput
                        value={slot.endTime}
                        onChangeText={(text) =>
                          updateTimeSlot(index, slotIndex, 'endTime', text)
                        }
                        placeholder="折扣結束"
                        style={styles.input}
                      />

                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 8,
                        }}
                      >
                        <Text style={{ marginRight: 10 }}>是否為折扣時段</Text>
                        <Switch
                          value={slot.isDiscount}
                          onValueChange={(value) =>
                            updateTimeSlot(
                              index,
                              slotIndex,
                              'isDiscount',
                              value
                            )
                          }
                        />
                      </View>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => {
                      const updatedSchedules = [...pricingSchedules];
                      updatedSchedules[index].timeSlots.push({
                        startTime: '',
                        endTime: '',
                        isDiscount: false,
                      });
                      setPricingSchedules(updatedSchedules);
                    }}
                    style={{
                      marginTop: 10,
                      backgroundColor: '#eee',
                      padding: 10,
                      borderRadius: 6,
                      alignItems: 'center',
                    }}
                  >
                    <Text>新增折扣時段</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.uploadContainer}>
                <Text style={styles.inputLabel}>上傳照片</Text>
                <View style={styles.uploadWrapper}>
                  {store?.id ? (
                    <>
                      {image ? (
                        <>
                          <Image
                            source={{ uri: image }}
                            style={styles.profileImage}
                          />
                        </>
                      ) : (
                        <>
                          <Image
                            src={getImageUrl(store.imgUrl)}
                            style={styles.profileImage}
                            resizeMode="cover"
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {image && (
                        <Image
                          source={{ uri: image }}
                          style={styles.profileImage}
                        />
                      )}
                    </>
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
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {isEditMode ? '更新' : '提交'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </ScrollView>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  backgroundImageWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },

  headerWrapper: { backgroundColor: '#FFFFFF' },
  contentWrapper: { flex: 1, padding: 20 },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#444',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },

  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },

  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#222',
  },

  scheduleContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fdfdfd',
  },

  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },

  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButtonText: { color: '#fff', fontSize: 18 },
  mapContainer: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },

  map: {
    flex: 1,
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
    marginBottom: 12,
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
  inputLabel: {
    fontSize: 22,
    marginBottom: 5,
  },
});

export default AddStoreScreen;
