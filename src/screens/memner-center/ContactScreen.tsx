import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ContactScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.timerSection}>
          <Text style={styles.price}>100元/小時</Text>
          <Text style={styles.timerText}>球局已進行</Text>
          <View style={styles.timerTimeContainer}>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>00</Text>
            </View>
            <Text style={styles.timerColon}>小時</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timerNumber}>03</Text>
            </View>
            <Text style={styles.timerColon}>分</Text>
          </View>
        </View>

        <View style={styles.contactContainer}>
          <FontAwesome
            name="phone"
            size={24}
            color="#424242"
            style={styles.contactIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.contactTitle}>聯絡店長</Text>
            <Text style={styles.contactSubtitle}>
              機台操作問題，請聯繫店長！
            </Text>
          </View>
        </View>

        {/* Warm Tips Section */}
        <View style={styles.warmTipsSection}>
          <Text style={styles.warmTipsHeader}>溫馨提示：</Text>
          {Array.from({ length: 5 }).map((_, index) => (
            <Text key={index} style={styles.warmTip}>
              {index + 1}. 溫馨提示溫馨提示溫馨提示溫馨提示溫馨提示
            </Text>
          ))}
        </View>

        {/* End Button */}
        <TouchableOpacity style={styles.endButton}>
          <Text style={styles.endButtonText}>結束球局</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7043',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 16,
  },
  timerTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  timerNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  timerColon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginHorizontal: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  warmTipsSection: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warmTipsHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  warmTip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  endButton: {
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  endButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ContactScreen;
