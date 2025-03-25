import { fetchPoolTableByUid } from '@/api/poolTableAPI';
import { showLoading, hideLoading } from '@/store/loadingSlice';
import { AppDispatch } from '@/store/store';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

const ReservationScreen = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute();
  const { tableUid } = route.params || {}; // 從參數中獲取桌檯 UID

  const [poolTable, setPoolTable] = useState(null);
  const [totalAmount, setTotalAmount] = useState(200); // 預設金額 200 元

  useEffect(() => {
    if (tableUid) {
      loadPoolTable();
    }
  }, [tableUid]);

  const loadPoolTable = async () => {
    try {
      dispatch(showLoading());
      const response = await fetchPoolTableByUid(tableUid);
      dispatch(hideLoading());
      if (response.success) {
        setPoolTable(response.data);
      } else {
        Alert.alert('錯誤', response.message || '無法獲取桌檯資訊');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error fetching pool table:', error);
    }
  };
  const handleConfirmPayment = () => {
    navigation.navigate('Payment', {
      type: 'game',
      payData: { uid: tableUid },
      totalAmount: poolTable?.deposit,
    });
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Time Slots */}
        {/* <View style={styles.timeSlots}>
          {[
            { time: '16:00~18:00', price: '100元/小時', reserved: false },
            { time: '18:00~20:00', price: '100元/小時', reserved: false },
            { time: '20:00~22:00', price: '', reserved: true },
          ].map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                slot.reserved
                  ? styles.timeSlotReserved
                  : styles.timeSlotAvailable,
              ]}
              disabled={slot.reserved}
              onPress={() => handleReservationPress(slot.time)}
            >
              <Text
                style={[
                  styles.timeText,
                  slot.reserved && styles.reservedTextStyle,
                ]}
              >
                {slot.time}
              </Text>
              <View style={styles.slotDetailsWrapper}>
                <View style={[styles.slotDetails, styles.slotDetailsBorder]}>
                  <Text style={styles.slotPrice}>{slot.price}</Text>
                  {slot.reserved && (
                    <Text style={styles.reservedText}>已預約</Text>
                  )}
                </View>
                <View style={styles.arrowIconWrapper}>
                  {!slot.reserved && (
                    <Icon
                      name="chevron-right"
                      size={24}
                      style={styles.arrowIcon}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Order Details */}
        <View style={styles.orderDetails}>
          <Text style={styles.orderItem}>訂單內容：</Text>
          <Text style={styles.orderDetail}>
            - 球桌租金 {poolTable?.deposit}
          </Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalAmount}>
              總金額：{poolTable?.deposit}元
            </Text>
          </View>
        </View>

        {/* Confirm Payment Button */}
        <View style={styles.confirmButtonWrapper}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.confirmButtonText}>確認付費</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#65BC85',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#65BC85',
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userBalance: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  locationInfo: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeSlots: {
    marginBottom: 16,
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#ddd',
  },
  timeSlotAvailable: {
    backgroundColor: '#6CDC95',
  },
  timeSlotReserved: {
    backgroundColor: '#B0B0B0',
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: 700,
  },
  reservedTextStyle: {},
  slotDetailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  slotDetails: {
    width: 106,
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },
  slotDetailsBorder: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 4,
  },
  slotPrice: {
    fontSize: 14,
    textAlign: 'center',
  },
  reservedText: {
    fontSize: 14,
  },
  arrowIconWrapper: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {},
  orderDetails: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  orderItem: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  orderDetail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C8545F',
  },
  confirmButtonWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  confirmButton: {
    minWidth: 169,
    backgroundColor: '#FFC702',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ReservationScreen;
