import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const IncomeAnalysisScreen = () => {
  const data = {
    labels: ['00', '04', '08', '12', '16', '20'],
    datasets: [
      {
        data: [2, 6, 8, 10, 5, 7],
        color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`, // 線條顏色
        strokeWidth: 2, // 線條寬度
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>收入項目分析</Text>

      {/* 收入數據區塊 */}
      <View style={styles.analysisBox}>
        <Text style={styles.label}>桌台金額：</Text>
        <Text style={styles.value}>80,000元</Text>
      </View>
      <View style={styles.analysisBox}>
        <Text style={styles.label}>商品金額：</Text>
        <Text style={styles.value}>20,000元</Text>
      </View>
      <View style={styles.analysisBox}>
        <Text style={styles.label}>會員儲值：</Text>
        <Text style={styles.value}>20,000元</Text>
      </View>

      {/* 折線圖 */}
      <Text style={styles.chartTitle}>各時段結帳筆數</Text>
      <LineChart
        data={data}
        width={300}
        height={220}
        chartConfig={{
          backgroundColor: '#FFF',
          backgroundGradientFrom: '#FFF',
          backgroundGradientTo: '#FFF',
          color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E3F2FD' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  analysisBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { fontSize: 16 },
  value: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  chart: { marginVertical: 8 },
});

export default IncomeAnalysisScreen;
