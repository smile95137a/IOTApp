import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const promotions = [{ id: '1', title: '尊榮會員', createdAt: '2024.09.28' }];

const PromotionSettingsScreen = ({ navigation }) => {
  return <SafeAreaView style={styles.safeArea}></SafeAreaView>;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  fixedImageContainer: {
    position: 'absolute', // Fix it to the block
    right: -200,
    bottom: 0,
    // Push it behind other content
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
    opacity: 0.1, // Make it subtle as a background
  },
  fixedImage: {
    width: 400,
    height: 400,
  },
  header: {
    backgroundColor: '#FFFFFF',
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },

  listContainer: {
    paddingBottom: 20,
  },
  promotionCard: {
    backgroundColor: '#FBAC3E',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  promotionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  promotionContentTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promotionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  promotionImage: {
    width: 114,
    height: 114,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
  },
  promotionDate: {
    fontSize: 12,
    color: '#2D3232',
  },
  addButton: {
    backgroundColor: '#F67943',
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default PromotionSettingsScreen;
