import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SpecialDateList = ({
  specialDates,
  updateSpecialDate,
  updateSpecialTimeSlot,
  addSpecialTimeSlot,
  removeSpecialTimeSlot,
  removeSpecialDate,
  hours,
  minutes,
  splitTime,
  formatTime,
  pickerStyle,
}: any) => {
  return (
    <View>
      {specialDates.map((item, dateIndex) => (
        <View
          key={dateIndex}
          style={{
            marginBottom: 20,
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
          }}
        >
          <TextInput
            editable={false}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
            placeholder="日期（YYYY-MM-DD）"
            value={item.date}
            onChangeText={(val) => updateSpecialDate(dateIndex, 'date', val)}
          />

          {/* 開始時間與結束時間 */}
          {['openTime', 'closeTime'].map((timeKey, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {timeKey === 'openTime' ? '開始時間' : '結束時間'}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(item[timeKey] || '00:00').hour)}
                    onValueChange={(hourStr) => {
                      const hour = parseInt(hourStr, 10);
                      const { minute } = splitTime(item[timeKey] || '00:00');
                      updateSpecialDate(
                        dateIndex,
                        timeKey,
                        formatTime(hour, minute)
                      );
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                    }))}
                    style={pickerStyle}
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
                    value={String(splitTime(item[timeKey] || '00:00').minute)}
                    onValueChange={(minStr) => {
                      const minute = parseInt(minStr, 10);
                      const { hour } = splitTime(item[timeKey] || '00:00');
                      updateSpecialDate(
                        dateIndex,
                        timeKey,
                        formatTime(hour, minute)
                      );
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                    }))}
                    style={pickerStyle}
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
            </View>
          ))}

          {/* 一般費用 */}
          <Text style={{ fontWeight: 'bold' }}>一般費用</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              backgroundColor: '#FFF',
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
            }}
            keyboardType="numeric"
            value={String(item.regularRate)}
            onChangeText={(val) =>
              updateSpecialDate(dateIndex, 'regularRate', parseFloat(val))
            }
          />

          {/* 優惠時段設定 */}

          <Text style={{ fontWeight: 'bold' }}>優惠時段</Text>
          {item.timeSlots.map((slot, slotIndex) => (
            <View key={slotIndex} style={{ marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>開始時間</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(slot.startTime).hour)}
                    onValueChange={(hourStr) => {
                      const hour = parseInt(hourStr, 10);
                      const { minute } = splitTime(slot.startTime);
                      updateSpecialTimeSlot(
                        dateIndex,
                        slotIndex,
                        'startTime',
                        formatTime(hour, minute)
                      );
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                    }))}
                    style={pickerStyle}
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
                      const minute = parseInt(minStr, 10);
                      const { hour } = splitTime(slot.startTime);
                      updateSpecialTimeSlot(
                        dateIndex,
                        slotIndex,
                        'startTime',
                        formatTime(hour, minute)
                      );
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                    }))}
                    style={pickerStyle}
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

              <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
                結束時間
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <RNPickerSelect
                    value={String(splitTime(slot.endTime).hour)}
                    onValueChange={(hourStr) => {
                      const hour = parseInt(hourStr, 10);
                      const { minute } = splitTime(slot.endTime);
                      updateSpecialTimeSlot(
                        dateIndex,
                        slotIndex,
                        'endTime',
                        formatTime(hour, minute)
                      );
                    }}
                    items={hours.map((h) => ({
                      label: `${h} 時`,
                      value: String(h),
                    }))}
                    style={pickerStyle}
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
                      const minute = parseInt(minStr, 10);
                      const { hour } = splitTime(slot.endTime);
                      updateSpecialTimeSlot(
                        dateIndex,
                        slotIndex,
                        'endTime',
                        formatTime(hour, minute)
                      );
                    }}
                    items={minutes.map((m) => ({
                      label: `${m} 分`,
                      value: String(m),
                    }))}
                    style={pickerStyle}
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

              {/* 費用 */}
              <TextInput
                placeholder="價格"
                keyboardType="numeric"
                value={String(slot.price)}
                onChangeText={(val) =>
                  updateSpecialTimeSlot(
                    dateIndex,
                    slotIndex,
                    'price',
                    parseFloat(val)
                  )
                }
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#FFF',
                  borderRadius: 8,
                  padding: 12,
                  marginTop: 10,
                }}
              />

              {/* 折扣開關 */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ marginRight: 8 }}>是否折扣</Text>
                <Switch
                  value={slot.isDiscount}
                  onValueChange={(val) =>
                    updateSpecialTimeSlot(
                      dateIndex,
                      slotIndex,
                      'isDiscount',
                      val
                    )
                  }
                />
              </View>

              <TouchableOpacity
                onPress={() => removeSpecialTimeSlot(dateIndex, slotIndex)}
                style={{
                  flex: 1,
                  marginRight: 6,
                  paddingVertical: 8,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#d9534f',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 4,
                }}
              >
                <MaterialIcons name="delete" size={20} color="#d9534f" />
                <Text style={{ color: '#d9534f', fontWeight: 'bold' }}>
                  刪除此時段
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* 刪除此時段 */}
          {/* 優惠時段內部：刪除此時段 / 新增折扣時段 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
              marginTop: 12,
            }}
          >
            <TouchableOpacity
              onPress={() => addSpecialTimeSlot(dateIndex)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                backgroundColor: '#007bff',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                新增時段
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeSpecialDate(dateIndex)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: '#900',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <MaterialIcons name="delete-forever" size={20} color="#900" />
              <Text style={{ color: '#900', fontWeight: 'bold' }}>
                刪除此特殊日期
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default SpecialDateList;
