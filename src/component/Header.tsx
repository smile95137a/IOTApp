import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  title?: string;
  onBackPress?: () => void; // 可选的返回按钮点击事件
  rightIcon?: string; // 可选的右侧图标名称
  onRightPress?: () => void; // 可选的右侧按钮点击事件
  isDarkMode?: boolean; // 切換黑白模式
}

const Header = ({
  title = '',
  onBackPress,
  rightIcon,
  onRightPress,
  isDarkMode = false, // 默認為黑色模式
}: HeaderProps) => {
  const iconColor = isDarkMode ? '#FFF' : '#000'; // 根据模式设置图标颜色
  const titleColor = isDarkMode ? '#FFF' : '#000'; // 根据模式设置标题颜色

  return (
    <View style={styles.header}>
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      <View style={styles.centerContent}>
        {title ? (
          <>
            <Image
              source={
                isDarkMode
                  ? require('@/assets/iot-logo-white.png') // 白色模式 Logo
                  : require('@/assets/iot-logo-black.png') // 黑色模式 Logo
              }
              style={styles.logo}
            />
            <Text style={[styles.headerTitle, { color: titleColor }]}>
              {title}
            </Text>
          </>
        ) : (
          <Image
            source={
              isDarkMode
                ? require('@/assets/iot-logo-white.png') // 白色模式大 Logo
                : require('@/assets/iot-logo-black.png') // 黑色模式大 Logo
            }
            style={styles.largeLogo}
          />
        )}
      </View>

      {/* 右侧按钮 */}
      {onRightPress && rightIcon ? (
        <TouchableOpacity onPress={onRightPress}>
          <Icon name={rightIcon} size={24} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // 占位符，确保标题居中
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
    marginLeft: 10,
  },
  centerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 78,
    height: 42,
    resizeMode: 'contain',
  },
  largeLogo: {
    width: 83,
    height: 52,
    resizeMode: 'contain',
  },
});

export default Header;
