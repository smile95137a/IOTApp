// component/admin/MultiDateSpecialModal.tsx
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Calendar } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MultiDateSpecialModal = ({
  selectedDatesMap,
  setSelectedDatesMap,
  tempOpenTime,
  setTempOpenTime,
  tempCloseTime,
  setTempCloseTime,
  tempRegularRate,
  setTempRegularRate,
  tempTimeSlots,
  setTempTimeSlots,
  onCancel,
  onConfirm,
  splitTime,
  formatTime,
  hours,
  minutes,
  pickerStyle,
}) => {
  return (
    <View style={{ padding: 20, backgroundColor: 'white' }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
        選擇多個日期
      </Text>
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

      {/* 營業時間設定 */}
      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>開始時間</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            value={String(splitTime(tempOpenTime).hour)}
            onValueChange={(hourStr) =>
              setTempOpenTime(
                formatTime(parseInt(hourStr), splitTime(tempOpenTime).minute)
              )
            }
            items={hours.map((h) => ({ label: `${h} 時`, value: String(h) }))}
            style={pickerStyle}
            placeholder={{ label: '時', value: '' }}
            Icon={() => (
              <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            value={String(splitTime(tempOpenTime).minute)}
            onValueChange={(minStr) =>
              setTempOpenTime(
                formatTime(splitTime(tempOpenTime).hour, parseInt(minStr))
              )
            }
            items={minutes.map((m) => ({ label: `${m} 分`, value: String(m) }))}
            style={pickerStyle}
            placeholder={{ label: '分', value: '' }}
            Icon={() => (
              <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
            )}
          />
        </View>
      </View>

      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>結束時間</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            value={String(splitTime(tempCloseTime).hour)}
            onValueChange={(hourStr) =>
              setTempCloseTime(
                formatTime(parseInt(hourStr), splitTime(tempCloseTime).minute)
              )
            }
            items={hours.map((h) => ({ label: `${h} 時`, value: String(h) }))}
            style={pickerStyle}
            placeholder={{ label: '時', value: '' }}
            Icon={() => (
              <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
            )}
          />
        </View>
        <View style={{ flex: 1 }}>
          <RNPickerSelect
            value={String(splitTime(tempCloseTime).minute)}
            onValueChange={(minStr) =>
              setTempCloseTime(
                formatTime(splitTime(tempCloseTime).hour, parseInt(minStr))
              )
            }
            items={minutes.map((m) => ({ label: `${m} 分`, value: String(m) }))}
            style={pickerStyle}
            placeholder={{ label: '分', value: '' }}
            Icon={() => (
              <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
            )}
          />
        </View>
      </View>

      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>一般費用</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          backgroundColor: '#f9f9f9',
        }}
        keyboardType="numeric"
        value={tempRegularRate}
        onChangeText={setTempRegularRate}
      />

      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>優惠時段</Text>
      {tempTimeSlots.map((slot, index) => (
        <View key={index} style={{ marginBottom: 12 }}>
          <TextInput
            placeholder="開始時間 (HH:mm)"
            value={slot.startTime}
            onChangeText={(val) => {
              const updated = [...tempTimeSlots];
              updated[index].startTime = val;
              setTempTimeSlots(updated);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              backgroundColor: '#fff',
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="結束時間 (HH:mm)"
            value={slot.endTime}
            onChangeText={(val) => {
              const updated = [...tempTimeSlots];
              updated[index].endTime = val;
              setTempTimeSlots(updated);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              backgroundColor: '#fff',
              marginBottom: 8,
            }}
          />
          <TextInput
            placeholder="價格"
            keyboardType="numeric"
            value={String(slot.price)}
            onChangeText={(val) => {
              const updated = [...tempTimeSlots];
              updated[index].price = parseFloat(val) || 0;
              setTempTimeSlots(updated);
            }}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              backgroundColor: '#fff',
              marginBottom: 8,
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ marginRight: 8 }}>是否折扣</Text>
            <Switch
              value={slot.isDiscount}
              onValueChange={(val) => {
                const updated = [...tempTimeSlots];
                updated[index].isDiscount = val;
                setTempTimeSlots(updated);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              const updated = [...tempTimeSlots];
              updated.splice(index, 1);
              setTempTimeSlots(updated);
            }}
          >
            <Text style={{ color: 'red' }}>刪除此時段</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={() =>
          setTempTimeSlots([
            ...tempTimeSlots,
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

      <TouchableOpacity
        style={{
          marginTop: 20,
          backgroundColor: '#007bff',
          padding: 12,
          borderRadius: 8,
        }}
        onPress={onConfirm}
      >
        <Text
          style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}
        >
          確定新增
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 12 }} onPress={onCancel}>
        <Text style={{ textAlign: 'center', color: '#888' }}>取消</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MultiDateSpecialModal;
