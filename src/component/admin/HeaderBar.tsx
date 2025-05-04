import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

interface HeaderBarProps {
  title: string;
  onRightPress?: () => void;
  showLeftButton?: boolean;
  showRightButton?: boolean;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onRightPress,
  showLeftButton = false,
  showRightButton = false,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {showLeftButton ? (
        <TouchableOpacity onPress={() => (navigation as any).goBack()}>
          <Icon
            name="chevron-left"
            size={28}
            color="#FFC702"
            style={styles.iconButton}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} /> // 占位，讓中間 logo/title 可以置中
      )}
      <View style={styles.headerContent}>
        <Image
          source={require('../../assets/iot-logo-no-text.png')}
          style={styles.logo}
        />
        <Text style={styles.header}>{title}</Text>
      </View>
      {showRightButton ? (
        <TouchableOpacity onPress={onRightPress}>
          <Icon
            name="more-vert"
            size={28}
            color="#FFC702"
            style={styles.iconButton}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 28 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#595858',
    width: '100%',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BFFF',
    marginLeft: 12,
  },
  iconButton: {
    padding: 5,
  },
});

export default HeaderBar;
