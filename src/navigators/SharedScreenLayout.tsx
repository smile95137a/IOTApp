import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface SharedScreenLayoutProps {
  navigation: any;
  title: string;
  children: React.ReactNode;
}

const SharedScreenLayout: React.FC<SharedScreenLayoutProps> = ({
  navigation,
  title,
  children,
}) => {
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Custom Hamburger Button */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => navigation.toggleDrawer()}
      >
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>

      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#f4f4f4',
  },
  hamburgerButton: {
    position: 'absolute',
    top: 60, // Distance from the top (adjust based on your UI needs)
    left: 10, // Distance from the left (adjust based on your UI needs)
    zIndex: 10, // Ensure it appears above other elements
    backgroundColor: '#fff', // Optional background for better visibility
    padding: 10, // Add padding around the icon
    borderRadius: 30, // Make it circular (optional)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 70, // Ensure content doesn't overlap with the button
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SharedScreenLayout;
