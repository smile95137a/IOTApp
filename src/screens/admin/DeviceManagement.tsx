import { useRoute } from '@react-navigation/native';
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HeaderBar from '../../component/admin/HeaderBar';

const DeviceManagementScreen = ({ navigation }) => {
  const route = useRoute();
  const storeId = route.params?.storeId;

  return (
    <SafeAreaView style={styles.deviceScreen}>
      <View style={styles.deviceScreen__container}>
        <View style={styles.deviceScreen__background}>
          <Image
            source={require('../../assets/iot-admin-bg.png')}
            style={{ width: '100%' }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.deviceScreen__header}>
          <HeaderBar showLeftButton title="設備管理" />
        </View>

        <View style={styles.deviceScreen__main}>
          {[
            {
              title: '環境管理',
              icon: require('../../assets/iot-switch.png'),
              target: 'EnvironmentManagement',
            },
            {
              title: '桌檯管理',
              icon: require('../../assets/iot-table-enable.png'),
              target: 'DeviceTableManagement',
            },
            {
              title: '攝影機管理',
              icon: require('../../assets/iot-mo-logo.png'),
              target: 'MonitorManagement',
            },
            {
              title: 'Router 管理',
              icon: require('../../assets/iot-router-logo.png'),
              target: 'RouterManagement',
            },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.deviceCard}
              onPress={() => navigation.navigate(item.target, { storeId })}
            >
              <View style={styles.deviceCard__content}>
                <Image source={item.icon} style={styles.deviceCard__icon} />
                <Text style={styles.deviceCard__text}>{item.title}</Text>
              </View>
              <View style={styles.deviceCard__button}>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deviceScreen: {
    flex: 1,
  },
  deviceScreen__container: {
    flex: 1,
  },
  deviceScreen__background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    right: 0,
    bottom: 0,
  },
  deviceScreen__header: {
    backgroundColor: '#FFFFFF',
  },
  deviceScreen__main: {
    flex: 1,
    padding: 20,
    zIndex: 3,
  },

  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    width: '100%',
    padding: 24,
    marginVertical: 10,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  deviceCard__content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceCard__icon: {
    width: 130,
    height: 100,
    marginRight: 15,
    resizeMode: 'contain',
  },
  deviceCard__text: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  deviceCard__button: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DeviceManagementScreen;
