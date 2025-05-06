import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  splitTime,
  formatTime,
  hours,
  minutes,
  isValidTime,
} from '../../utils/timeUtils';
import { useDialog } from '../../context/DialogContext';

const { width, height } = Dimensions.get('window');

const MultiDateSpecialDialog: React.FC<any> = ({
  isOpen,
  title = '本桌已被使用中！',
  content,
  onClose,
  onConfirm,
  confirmText = '預約開台',
  cancelText = '結束',
}) => {
  if (!isOpen) return null;
  const { openInfoDialog } = useDialog();
  const [selectedDatesMap, setSelectedDatesMap] = useState({});
  const [openTime, setOpenTime] = useState('00:00');
  const [closeTime, setCloseTime] = useState('23:59');
  const [regularRate, setRegularRate] = useState('100');
  const [timeSlots, setTimeSlots] = useState([
    { startTime: '00:00', endTime: '13:00', isDiscount: true, price: 100 },
  ]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const selectedDates = Object.keys(selectedDatesMap).filter(
      (d) => selectedDatesMap[d]
    );

    if (selectedDates.length === 0) {
      await openInfoDialog({
        title: '請選擇日期',
        content: '請至少選擇一個日期進行設定',
      });
      return;
    }

    if (
      !isValidTime(openTime) ||
      !isValidTime(closeTime) ||
      !regularRate ||
      isNaN(+regularRate)
    ) {
      await openInfoDialog({
        title: '一般時段錯誤',
        content: '請填寫正確的一般時段時間與費用',
      });
      return;
    }

    for (let i = 0; i < timeSlots.length; i++) {
      const slot = timeSlots[i];
      if (
        !isValidTime(slot.startTime) ||
        !isValidTime(slot.endTime) ||
        slot.price === '' ||
        isNaN(+slot.price)
      ) {
        await openInfoDialog({
          title: `第 ${i + 1} 組資料錯誤`,
          content: '優惠時段的開始/結束時間與價格皆為必填，請檢查是否填寫完整',
        });
        return;
      }
    }

    const specialDates = selectedDates.map((date) => ({
      date,
      openTime,
      closeTime,
      regularRate: ~~regularRate,
      timeSlots: [...timeSlots],
    }));

    onConfirm(specialDates);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.dialog}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <Text style={styles.title}>選擇多個日期</Text>
          <Calendar
            markedDates={Object.keys(selectedDatesMap).reduce((acc, date) => {
              acc[date] = {
                selected: true,
                marked: true,
                selectedColor: '#00adf5',
              };
              return acc;
            }, {})}
            onDayPress={(day) => {
              const dateStr = day.dateString;
              setSelectedDatesMap((prev) => ({
                ...prev,
                [dateStr]: !prev[dateStr],
              }));
            }}
          />

          <Text style={styles.label}>開始時間</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <RNPickerSelect
                value={String(splitTime(openTime).hour)}
                onValueChange={(hourStr) =>
                  setOpenTime(
                    formatTime(parseInt(hourStr), splitTime(openTime).minute)
                  )
                }
                items={hours.map((h) => ({
                  label: `${h} 時`,
                  value: String(h),
                }))}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.iconContainer,
                }}
                placeholder={{ label: '時', value: '' }}
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
                onValueChange={(minStr) =>
                  setOpenTime(
                    formatTime(splitTime(openTime).hour, parseInt(minStr))
                  )
                }
                items={minutes.map((m) => ({
                  label: `${m} 分`,
                  value: String(m),
                }))}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.iconContainer,
                }}
                placeholder={{ label: '分', value: '' }}
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

          <Text style={styles.label}>結束時間</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <RNPickerSelect
                value={String(splitTime(closeTime).hour)}
                onValueChange={(hourStr) =>
                  setCloseTime(
                    formatTime(parseInt(hourStr), splitTime(closeTime).minute)
                  )
                }
                items={hours.map((h) => ({
                  label: `${h} 時`,
                  value: String(h),
                }))}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.dropdownInput,
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.iconContainer,
                }}
                placeholder={{ label: '時', value: '' }}
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
                onValueChange={(minStr) =>
                  setCloseTime(
                    formatTime(splitTime(closeTime).hour, parseInt(minStr))
                  )
                }
                items={minutes.map((m) => ({
                  label: `${m} 分`,
                  value: String(m),
                }))}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: styles.dropdownInput,
                  inputAndroid: styles.dropdownInput,
                  iconContainer: styles.iconContainer,
                }}
                placeholder={{ label: '分', value: '' }}
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

          <Text style={styles.label}>一般費用</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={regularRate}
            onChangeText={setRegularRate}
          />

          <Text style={styles.label}>優惠時段</Text>
          {timeSlots.map((slot, index) => (
            <View key={index} style={styles.slotBlock}>
              <Text style={styles.label}>開始時間</Text>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(slot.startTime).hour)}
                    onValueChange={(hourStr) => {
                      const updated = [...timeSlots];
                      updated[index].startTime = formatTime(
                        parseInt(hourStr),
                        splitTime(slot.startTime).minute
                      );
                      setTimeSlots(updated);
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    placeholder={{ label: '時', value: '' }}
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
                      const updated = [...timeSlots];
                      updated[index].startTime = formatTime(
                        splitTime(slot.startTime).hour,
                        parseInt(minStr)
                      );
                      setTimeSlots(updated);
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    placeholder={{ label: '分', value: '' }}
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

              <Text style={styles.label}>結束時間</Text>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(slot.endTime).hour)}
                    onValueChange={(hourStr) => {
                      const updated = [...timeSlots];
                      updated[index].endTime = formatTime(
                        parseInt(hourStr),
                        splitTime(slot.endTime).minute
                      );
                      setTimeSlots(updated);
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    placeholder={{ label: '時', value: '' }}
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
                      const updated = [...timeSlots];
                      updated[index].endTime = formatTime(
                        splitTime(slot.endTime).hour,
                        parseInt(minStr)
                      );
                      setTimeSlots(updated);
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                    }))}
                    useNativeAndroidPickerStyle={false}
                    style={{
                      inputIOS: styles.dropdownInput,
                      inputAndroid: styles.dropdownInput,
                      iconContainer: styles.iconContainer,
                    }}
                    placeholder={{ label: '分', value: '' }}
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

              <Text style={styles.label}>優惠費用</Text>
              <TextInput
                placeholder="價格"
                keyboardType="numeric"
                value={String(slot.price)}
                onChangeText={(val) => {
                  const updated = [...timeSlots];
                  updated[index].price = ~~val || 0;
                  setTimeSlots(updated);
                }}
                style={styles.input}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 8 }}>是否折扣</Text>
                <Switch
                  value={slot.isDiscount}
                  onValueChange={(val) => {
                    const updated = [...timeSlots];
                    updated[index].isDiscount = val;
                    setTimeSlots(updated);
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  const updated = [...timeSlots];
                  updated.splice(index, 1);
                  setTimeSlots(updated);
                }}
              >
                <Text style={{ color: 'red' }}>刪除此時段</Text>
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
                  price: 0,
                },
              ])
            }
          >
            <Text style={{ color: '#007bff', marginBottom: 16 }}>
              新增一組優惠時段
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>確定新增</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MultiDateSpecialDialog;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialog: {
    backgroundColor: '#fff',
    width: '90%',
    maxHeight: height * 0.8, // <-- 加這行
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  slotBlock: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  confirmButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
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
