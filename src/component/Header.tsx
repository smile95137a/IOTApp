import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface HeaderProps {
  title: string; // 标题文字
  onBackPress?: () => void; // 可选的返回按钮点击事件
  rightIcon?: string; // 可选的右侧图标名称
  onRightPress?: () => void; // 可选的右侧按钮点击事件
  titleColor?: string; // 可选的标题文字颜色
  iconColor?: string; // 可选的图标颜色
}

const Header = ({
  title,
  onBackPress,
  rightIcon,
  onRightPress,
  titleColor = '#000', // 默认标题文字颜色为黑色
  iconColor = '#000', // 默认图标颜色为黑色
}: HeaderProps) => {
  return (
    <View style={styles.header}>
      {/* 返回按钮 */}
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <Icon name="arrow-back" size={24} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // 占位符，确保标题居中
      )}

      {/* 标题 */}
      <Text style={[styles.headerTitle, { color: titleColor }]}>{title}</Text>

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
  },
});

export default Header;
