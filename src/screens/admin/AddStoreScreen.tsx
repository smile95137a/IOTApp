import React, { useEffect, useRef, useState } from 'react';
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
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector } from 'react-redux';
import { fetchUsersByRole } from '../../api/admin/roleApi';
import {
  createStore,
  updateStore,
  uploadStoreImages,
} from '../../api/admin/storeApi';
import { fetchAllVendors } from '../../api/admin/vendorApi';
import HeaderBar from '../../component/admin/HeaderBar';
import { useDialog } from '../../context/DialogContext';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { AppDispatch, RootState } from '../../store/store';
import { getErrorMessage } from '../../utils/errorUtils';
import { getImageUrl } from '../../utils/ImageUtils';
import { logJson } from '../../utils/logJsonUtils';

const AddStoreScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog, openConfirmDialog } = useDialog();
  const loginUser = useSelector((state: RootState) => state.user);
  const isSuperAdmin = loginUser?.user?.roles?.some((role) => role.id === 1);

  const store = route.params?.store || null;
  const mapRef = useRef<MapView>(null);
  const isEditMode = !!store;
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(
    store?.user?.id ? String(store.user.id) : ''
  );

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
  } | null>(
    store ? { latitude: Number(store.lat), longitude: Number(store.lon) } : null
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
          await openInfoDialog({
            title: '錯誤',
            content: '無法獲取加盟商列表',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        if (error.isAutoLogout) return;
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadVendors();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        dispatch(showLoading());
        const response = await fetchUsersByRole(5);
        dispatch(hideLoading());

        if (response.success) {
          const fetchedUsers = response.data;

          // 篩選 isUsed 為 false 的使用者
          let filteredUsers = fetchedUsers.filter(
            (user) => user.isUsed === false
          );

          // 如果是編輯模式，且目前店長不是 isUsed === false，要補進來
          if (isEditMode) {
            const currentUser = fetchedUsers.find(
              (user) => String(user.id) === String(userId)
            );
            const alreadyIncluded = filteredUsers.some(
              (user) => String(user.id) === String(userId)
            );
            if (currentUser && !alreadyIncluded) {
              filteredUsers.push(currentUser);
            }
          }

          setUsers(filteredUsers);
        } else {
          await openInfoDialog({
            title: '錯誤',
            content: '無法獲取使用者清單',
            confirmText: '我知道了',
          });
        }
      } catch (error: any) {
        dispatch(hideLoading());
        await openInfoDialog({
          title: '錯誤',
          content: getErrorMessage(error),
        });
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async () => {
    if (
      !name.trim() ||
      !address.trim() ||
      !vendorId.trim() ||
      !lat.trim() ||
      !lon.trim() ||
      !userId.trim()
    ) {
      await openInfoDialog({
        title: '錯誤',
        content: '請填寫完整資訊',
        confirmText: '我知道了',
      });
      return;
    }

    const storeData = {
      name,
      address,
      hint,
      contactPhone,
      user: { id: userId },
      vendor: { id: parseInt(vendorId) },
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      deposit: parseFloat(deposit) || 0,
      discountRate: parseFloat(discountRate) || 0,
      regularRate: parseFloat(regularRate) || 0,
      openTime,
      closeTime,
      timeSlots: timeSlots.map((slot) => ({ ...slot })),
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
        await openInfoDialog({
          title: '成功',
          content: isEditMode ? '店家資訊更新成功' : '店家新增成功',
          confirmText: '確定',
        });
        (navigation as any).goBack();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '操作失敗',
          confirmText: '我知道了',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleUploadPhoto = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相簿權限',
        confirmText: '我知道了',
      });
      return;

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
      await openInfoDialog({
        title: '權限不足',
        content: '請允許存取相機權限',
        confirmText: '我知道了',
      });
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

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const confirmed = await openConfirmDialog({
      title: '確認選擇',
      content: `你選擇的位置：\n緯度: ${latitude}\n經度: ${longitude}`,
      confirmText: '確定',
      cancelText: '取消',
    });

    if (confirmed) {
      setSelectedLocation({ latitude, longitude });
      setLat(String(latitude));
      setLon(String(longitude));
    }
  };

  const confirmRemoveTimeSlot = async (slotIndex) => {
    const confirmed = await openConfirmDialog({
      title: '確定刪除',
      content: '你要刪除這個折扣時段嗎？',
      confirmText: '刪除',
      cancelText: '取消',
    });
    if (confirmed) removeTimeSlot(slotIndex);
  };

  const geocodeAddress = async (inputAddress: string) => {
    try {
      const apiKey = Constants?.expoConfig?.extra?.eas?.googleMapsApiKey;
      if (!apiKey) {
        await openInfoDialog({
          title: '錯誤',
          content: '缺少 Google Maps API 金鑰',
          confirmText: '我知道了',
        });
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          inputAddress
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        setLat(location.lat.toString());
        setLon(location.lng.toString());
        setSelectedLocation({
          latitude: location.lat,
          longitude: location.lng,
        });
        mapRef.current?.animateToRegion(
          {
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      } else {
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
    }
  };
  const splitTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    return {
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
    };
  };

  const formatTime = (hour, minute) =>
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const [timeSlots, setTimeSlots] = useState(
    store?.timeSlots?.length
      ? store.timeSlots
      : [
          {
            startTime: '00:00',
            endTime: '23:59',
            isDiscount: true,
          },
        ]
  );
  const [openTime, setOpenTime] = useState(store?.openTime || '00:00');
  const [closeTime, setCloseTime] = useState(store?.closeTime || '23:59');

  const updateTimeSlot = (slotIndex, key, value) => {
    const updated = [...timeSlots];
    updated[slotIndex] = {
      ...updated[slotIndex],
      [key]: value,
    };
    setTimeSlots(updated);
  };

  const removeTimeSlot = (slotIndex) => {
    const updated = [...timeSlots];
    updated.splice(slotIndex, 1);
    setTimeSlots(updated);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.backgroundImageWrapper}>
              <Image
                source={require('../../assets/iot-admin-bg.png')}
                style={{ width: '100%' }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerWrapper}>
              <HeaderBar title={isEditMode ? '編輯店家' : '新增店家'} />
            </View>

            <View style={styles.contentWrapper}>
              <Text style={styles.inputLabel}>加盟商</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={vendorId}
                    onValueChange={(value) => {
                      if (value) setVendorId(value);
                    }}
                    items={vendors.map((vendor) => ({
                      label: vendor.name,
                      value: String(vendor.id),
                      key: vendor.id,
                    }))}
                    placeholder={{ label: '請選擇加盟商', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
              </View>
              <Text style={styles.inputLabel}>店長</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={userId}
                    onValueChange={(value) => {
                      if (value) setUserId(value);
                    }}
                    items={users.map((user) => ({
                      label: user.name,
                      value: String(user.id),
                      key: user.id,
                    }))}
                    placeholder={{ label: '請選擇店長', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
              </View>
              <Text style={styles.inputLabel}>店家名稱</Text>
              <TextInput
                style={styles.input}
                placeholder="店家名稱"
                value={name}
                onChangeText={setName}
              />
              <Text style={styles.inputLabel}>店家地址</Text>
              <TextInput
                style={styles.input}
                placeholder="地址"
                value={address}
                onChangeText={setAddress}
                onBlur={() => {
                  if (address.trim()) {
                    geocodeAddress(address);
                  }
                }}
              />
              <Text style={styles.inputLabel}>店家地圖</Text>
              <View style={styles.mapContainer}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_DEFAULT}
                  style={styles.map}
                  initialRegion={{
                    latitude: selectedLocation?.latitude ?? 25.033964,
                    longitude: selectedLocation?.longitude ?? 121.564468,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  onPress={handleMapPress}
                  onStartShouldSetResponder={() => true}
                  onMoveShouldSetResponder={() => true}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
              </View>
              <Text style={styles.inputLabel}>緯度 (Lat)</Text>
              <TextInput
                style={styles.input}
                placeholder="緯度 (Lat)"
                keyboardType="numeric"
                value={lat}
                onChangeText={setLat}
                readOnly={true}
              />
              <Text style={styles.inputLabel}>經度 (Lon)</Text>
              <TextInput
                style={styles.input}
                placeholder="經度 (Lon)"
                keyboardType="numeric"
                value={lon}
                onChangeText={setLon}
                readOnly={true}
              />
              <Text style={styles.inputLabel}>開台押金</Text>
              <TextInput
                style={styles.input}
                placeholder="開台押金"
                keyboardType="numeric"
                value={deposit}
                onChangeText={setDeposit}
              />
              <Text style={styles.inputLabel}>溫馨提示</Text>
              <TextInput
                style={styles.input}
                placeholder="溫馨提示"
                value={hint}
                onChangeText={setHint}
                multiline
              />
              <Text style={styles.inputLabel}>電話</Text>
              <TextInput
                style={styles.input}
                placeholder="電話"
                value={contactPhone}
                onChangeText={setContactPhone}
              />
              <Text style={styles.inputLabel}>費用與時段</Text>
              <Text style={styles.inputLabel}>營業開始時間 (Open Time)</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(openTime).hour)}
                    onValueChange={(hourStr) => {
                      const hour = parseInt(hourStr, 10);
                      const { minute } = splitTime(openTime);
                      setOpenTime(formatTime(hour, minute));
                    }}
                    items={hours.map((h) => ({
                      label: `${h} h`,
                      value: String(h),
                      key: h,
                    }))}
                    placeholder={{ label: 'Hour', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(openTime).minute)}
                    onValueChange={(minStr) => {
                      const minute = parseInt(minStr, 10);
                      const { hour } = splitTime(openTime);
                      setOpenTime(formatTime(hour, minute));
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} m`,
                      value: String(m),
                      key: m,
                    }))}
                    placeholder={{ label: 'Minute', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>營業結束時間 (Close Time)</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(closeTime).hour)}
                    onValueChange={(hourStr) => {
                      const hour = parseInt(hourStr, 10);
                      const { minute } = splitTime(closeTime);
                      setCloseTime(formatTime(hour, minute));
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                      key: h,
                    }))}
                    placeholder={{ label: 'Hour', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(closeTime).minute)}
                    onValueChange={(minStr) => {
                      const minute = parseInt(minStr, 10);
                      const { hour } = splitTime(closeTime);
                      setCloseTime(formatTime(hour, minute));
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                      key: m,
                    }))}
                    placeholder={{ label: 'Minute', value: '' }}
                    useNativeAndroidPickerStyle={false}
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
                  />
                </View>
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputLabel}>折扣時段</Text>
                {timeSlots.map((slot, slotIndex) => (
                  <View
                    key={slotIndex}
                    style={{ marginTop: 8, marginBottom: 16 }}
                  >
                    <Text style={styles.inputLabel}>開始時間</Text>
                    <View
                      style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}
                    >
                      <View style={{ flex: 1 }}>
                        <RNPickerSelect
                          value={String(splitTime(slot.startTime).hour)}
                          onValueChange={(hourStr) => {
                            const hour = parseInt(hourStr, 10);
                            const { minute } = splitTime(slot.startTime);
                            updateTimeSlot(
                              slotIndex,
                              'startTime',
                              formatTime(hour, minute)
                            );
                          }}
                          items={hours.map((h) => ({
                            label: `${h} h`,
                            value: String(h),
                            key: h,
                          }))}
                          placeholder={{ label: 'Hour', value: '' }}
                          useNativeAndroidPickerStyle={false}
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
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <RNPickerSelect
                          value={String(splitTime(slot.startTime).minute)}
                          onValueChange={(minStr) => {
                            const minute = parseInt(minStr, 10);
                            const { hour } = splitTime(slot.startTime);
                            updateTimeSlot(
                              slotIndex,
                              'startTime',
                              formatTime(hour, minute)
                            );
                          }}
                          items={minutes.map((m) => ({
                            label: `${m} m`,
                            value: String(m),
                            key: m,
                          }))}
                          placeholder={{ label: 'Minute', value: '' }}
                          useNativeAndroidPickerStyle={false}
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
                        />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>結束時間</Text>
                    <View
                      style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}
                    >
                      <View style={{ flex: 1 }}>
                        <RNPickerSelect
                          value={String(splitTime(slot.endTime).hour)}
                          onValueChange={(hourStr) => {
                            const hour = parseInt(hourStr, 10);
                            const { minute } = splitTime(slot.endTime);
                            updateTimeSlot(
                              slotIndex,
                              'endTime',
                              formatTime(hour, minute)
                            );
                          }}
                          items={hours.map((h) => ({
                            label: `${h} h`,
                            value: String(h),
                            key: h,
                          }))}
                          placeholder={{ label: 'Hour', value: '' }}
                          useNativeAndroidPickerStyle={false}
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
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <RNPickerSelect
                          value={String(splitTime(slot.endTime).minute)}
                          onValueChange={(minStr) => {
                            const minute = parseInt(minStr, 10);
                            const { hour } = splitTime(slot.endTime);
                            updateTimeSlot(
                              slotIndex,
                              'endTime',
                              formatTime(hour, minute)
                            );
                          }}
                          items={minutes.map((m) => ({
                            label: `${m} m`,
                            value: String(m),
                            key: m,
                          }))}
                          placeholder={{ label: 'Minute', value: '' }}
                          useNativeAndroidPickerStyle={false}
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
                        />
                      </View>
                    </View>

                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text style={{ marginRight: 10 }}>是否為折扣時段</Text>
                      <Switch
                        value={slot.isDiscount}
                        onValueChange={(value) =>
                          updateTimeSlot(slotIndex, 'isDiscount', value)
                        }
                      />
                    </View>

                    <TouchableOpacity
                      onPress={() => confirmRemoveTimeSlot(slotIndex)}
                      style={{
                        marginTop: 8,
                        padding: 8,
                        backgroundColor: '#ffcccc',
                        borderRadius: 6,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#900' }}>刪除這個折扣時段</Text>
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity
                  onPress={() =>
                    setTimeSlots([
                      ...timeSlots,
                      {
                        startTime: '10:00',
                        endTime: '13:00',
                        isDiscount: false,
                      },
                    ])
                  }
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>新增折扣時段</Text>
                </TouchableOpacity>
              </View>

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
              {isSuperAdmin && (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitButtonText}>
                    {isEditMode ? '更新' : '提交'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    fontSize: 14,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF',
  },
  iconContainer: {
    top: '50%',
    right: 10,
    marginTop: -12,
    position: 'absolute',
  },
});

export default AddStoreScreen;
