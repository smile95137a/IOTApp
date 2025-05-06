import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { splitTime, formatTime, hours, minutes } from '../../utils/timeUtils';
import moment from 'moment';

const SpecialDateList = ({
  specialDates,
  updateSpecialDate,
  updateSpecialTimeSlot,
  addSpecialTimeSlot,
  removeSpecialTimeSlot,
  removeSpecialDate,
}: any) => {
  const groupDatesByMonth = (dates) => {
    // 先依照日期排序（升冪）
    const sorted = [...dates].sort((a, b) =>
      moment(a.date).diff(moment(b.date))
    );

    // 再分組
    const map = new Map();
    sorted.forEach((item) => {
      const monthKey = moment(item.date).format('YYYY-MM');
      if (!map.has(monthKey)) {
        map.set(monthKey, []);
      }
      map.get(monthKey).push(item);
    });

    return Array.from(map.entries());
  };
  const getDateColor = (dateStr: string) => {
    const date = moment(dateStr, 'YYYY-MM-DD');
    if (date.isSame(moment(), 'day')) return '#007bff'; // 今天
    if (date.day() === 0 || date.day() === 6) return '#d9534f'; // 週六日
    return '#333'; // 其他
  };

  return (
    <>
      <View>
        {groupDatesByMonth(specialDates).map(([month, dateList]) => (
          <View key={month} style={{ marginBottom: 24 }}>
            <Text
              style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 12 }}
            >
              {moment(month).format('YYYY年 M月')}
            </Text>

            <View style={styles.gridWrapper}>
              {dateList.map((item) => {
                const globalIndex = specialDates.findIndex((d) => d === item); // 保留原始 index

                return (
                  <View key={globalIndex} style={styles.cardWrapper}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: getDateColor(item.date),
                        marginBottom: 10,
                      }}
                    >
                      {item.date}
                    </Text>

                    {/* <TextInput
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
                      onChangeText={(val) =>
                        updateSpecialDate(dateIndex, 'date', val)
                      }
                    /> */}

                    {/* 開始時間與結束時間 */}
                    {['openTime', 'closeTime'].map((timeKey, i) => (
                      <View key={i} style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>
                          {timeKey === 'openTime' ? '開始時間' : '結束時間'}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={{ flex: 1 }}>
                            <RNPickerSelect
                              value={String(
                                splitTime(item[timeKey] || '00:00').hour
                              )}
                              onValueChange={(hourStr) => {
                                const hour = parseInt(hourStr, 10);
                                const { minute } = splitTime(
                                  item[timeKey] || '00:00'
                                );
                                updateSpecialDate(
                                  globalIndex,
                                  timeKey,
                                  formatTime(hour, minute)
                                );
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
                              value={String(
                                splitTime(item[timeKey] || '00:00').minute
                              )}
                              onValueChange={(minStr) => {
                                const minute = parseInt(minStr, 10);
                                const { hour } = splitTime(
                                  item[timeKey] || '00:00'
                                );
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
                        updateSpecialDate(globalIndex, 'regularRate', ~~val)
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
                                  globalIndex,
                                  slotIndex,
                                  'startTime',
                                  formatTime(hour, minute)
                                );
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
                                const minute = parseInt(minStr, 10);
                                const { hour } = splitTime(slot.startTime);
                                updateSpecialTimeSlot(
                                  globalIndex,
                                  slotIndex,
                                  'startTime',
                                  formatTime(hour, minute)
                                );
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
                                  globalIndex,
                                  slotIndex,
                                  'endTime',
                                  formatTime(hour, minute)
                                );
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
                                const minute = parseInt(minStr, 10);
                                const { hour } = splitTime(slot.endTime);
                                updateSpecialTimeSlot(
                                  globalIndex,
                                  slotIndex,
                                  'endTime',
                                  formatTime(hour, minute)
                                );
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

                        {/* 費用 */}
                        <TextInput
                          placeholder="價格"
                          keyboardType="numeric"
                          value={String(slot.price)}
                          onChangeText={(val) =>
                            updateSpecialTimeSlot(
                              globalIndex,
                              slotIndex,
                              'price',
                              ~~val
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

                        <TouchableOpacity
                          onPress={() =>
                            removeSpecialTimeSlot(globalIndex, slotIndex)
                          }
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
                            marginTop: 10,
                          }}
                        >
                          <MaterialIcons
                            name="delete"
                            size={10}
                            color="#d9534f"
                          />
                          <Text
                            style={{
                              color: '#d9534f',
                              fontWeight: 'bold',
                              fontSize: 10,
                            }}
                          >
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
                        onPress={() => addSpecialTimeSlot(globalIndex)}
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
                        <MaterialIcons name="add" size={10} color="#fff" />
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 10,
                          }}
                        >
                          新增時段
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeSpecialDate(globalIndex)}
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
                        <MaterialIcons
                          name="delete-forever"
                          size={10}
                          color="#900"
                        />
                        <Text
                          style={{
                            color: '#900',
                            fontWeight: 'bold',
                            fontSize: 10,
                          }}
                        >
                          刪除日期
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 14,
    marginBottom: 8,
    marginHorizontal: '1%',
  },
});

export default SpecialDateList;
