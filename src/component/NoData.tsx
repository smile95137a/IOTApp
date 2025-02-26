import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface NoDataProps {
  text?: string;
}

const NoData: React.FC<NoDataProps> = ({
  text = '查無資料！您可嘗試其他搜尋條件！',
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/iot-login-logo.png')}
        style={styles.image}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100, // 根據實際需求調整尺寸
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default NoData;
