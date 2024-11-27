import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For icons
import ImageCarousel from '@/component/ImageCarousel';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Banner Section */}
        <ImageCarousel />

        {/* Cards Section */}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.cardContainer}>
            {/* Explore Card */}
            <TouchableOpacity style={[styles.card, styles.greenCard]}>
              <Image
                source={require('@/assets/iot-home1.png')}
                style={styles.cardImage}
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardSubtitle}>最近分店：</Text>
                <Text style={styles.cardSubtitle}>寶慶店 500m</Text>
                <Text style={styles.cardSubtitle}>西門店 1.2 km</Text>
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                onPress={() =>
                  navigation.navigate('門市探索', { screen: 'StoreScreen' })
                }
              >
                <Text style={styles.cardButtonText}>門市探索</Text>
                <MaterialIcons name="chevron-right" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* QR Scanner Card */}
            <TouchableOpacity
              style={[styles.card, styles.orangeCard]}
              onPress={() => navigation.navigate('QRScannerScreen')}
            >
              <Image
                source={require('@/assets/iot-home2.png')}
                style={styles.cardImage}
              />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardSubtitle}>
                  掃描球桌上的QRcode開台/開台
                </Text>
              </View>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>掃碼開台</Text>
                <MaterialIcons name="chevron-right" size={20} color="#000" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#409D62',
  },
  container: {
    flex: 1,
    padding: 16, // Padding for the entire container
    backgroundColor: '#f8f8f8',
  },
  banner: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#fff',
  },
  content: {
    paddingBottom: 20, // Padding for scrollable content
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greenCard: {
    backgroundColor: '#65BC85',
  },
  orangeCard: {
    backgroundColor: '#F67943',
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardTextContainer: {
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  cardButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
});

export default HomeScreen;
