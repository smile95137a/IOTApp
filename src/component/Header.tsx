import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightIcon?: string;
  rightText?: string;
  onRightPress?: () => void;
  isDarkMode?: boolean;
}

const Header = ({
  title = '',
  onBackPress,
  rightIcon,
  rightText,
  onRightPress,
  isDarkMode = false,
}: HeaderProps) => {
  const iconColor = isDarkMode ? '#FFC702' : '#000';
  const titleColor = isDarkMode ? '#00BFFF' : '#000';

  return (
    <View style={styles.header}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="chevron-left" size={48} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 48 }} />
      )}
      <View style={styles.centerContent}>
        <View style={styles.logoContainer}>
          <Image
            source={
              isDarkMode
                ? require('../assets/i-Pool_logo_RGB_2.png') // 白色模式 Logo
                : require('../assets/i-Pool_logo_RGB_1.png') // 黑色模式 Logo
            }
            style={styles.logo}
          />
          {title && (
            <Text style={[styles.headerTitle, { color: titleColor }]}>
              {title}
            </Text>
          )}
        </View>
      </View>

      {/* 右侧按钮 */}
      {/* 右側：不可點的文字 or 可點的 icon */}
      {rightText ? (
        <View>
          <Text style={[styles.rightText, { color: iconColor }]}>
            {rightText}
          </Text>
        </View>
      ) : onRightPress && rightIcon ? (
        <TouchableOpacity onPress={onRightPress}>
          <Icon name={rightIcon} size={48} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 48 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 89.1,
    height: 66.6,
    resizeMode: 'contain',
  },
  largeLogo: {
    width: 63,
    height: 72,
    resizeMode: 'contain',
  },
  rightText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default Header;
