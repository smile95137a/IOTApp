import Header from '@/component/Header';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const ReportSummaryScreen = ({ navigation }: any) => {
  const lineChartData = {
    labels: ['00', '04', '08', '12', '16', '20'],
    datasets: [
      {
        data: [2, 6, 8, 10, 5, 7],
        color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const pieChartData = [
    {
      name: '信用卡',
      population: 80000,
      color: '#FF7043',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: 'LINE PAY',
      population: 30000,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
    {
      name: '街口支付',
      population: 10000,
      color: '#2196F3',
      legendFontColor: '#333',
      legendFontSize: 14,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.fixedImageContainer}>
          <Image
            source={require('@/assets/iot-threeBall.png')}
            resizeMode="contain"
          />
        </View>
        {/* Header */}
        <View style={styles.header}>
          <Header title="經營報表" onBackPress={() => navigation.goBack()} />
        </View>
        <View style={styles.mainContainer}>
          {/* 日期切換區域 */}
          <View style={styles.dateContainer}>
            <TouchableOpacity>
              <Text style={styles.dateNav}>前一日</Text>
            </TouchableOpacity>
            <Text style={styles.date}>2024.09.28</Text>
            <TouchableOpacity>
              <Text style={styles.dateNav}>後一日</Text>
            </TouchableOpacity>
          </View>

          {/* 營業數據區域 */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>營業總額：</Text>
              <Text style={styles.value}>100,000元 / 1,200筆</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>會員結帳：</Text>
              <Text style={styles.value}>80,000元 / 1,000筆</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>商家優惠：</Text>
              <Text style={styles.value}>10,000元 / 100筆</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.label}>退款：</Text>
              <Text style={styles.value}>0元 / 0筆</Text>
            </View>
          </View>

          {/* 支付方式分析 */}
          <View style={styles.analysisBox}>
            <Text style={styles.sectionTitle}>支付方式分析</Text>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>信用卡：</Text>
              <Text style={styles.value}>80,000元 / 600筆</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>LINE PAY：</Text>
              <Text style={styles.value}>10,000元 / 300筆</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>街口支付：</Text>
              <Text style={styles.value}>10,000元 / 300筆</Text>
            </View>
          </View>

          {/* 收入項目分析 */}
          <View style={styles.analysisBox}>
            <Text style={styles.sectionTitle}>收入項目分析</Text>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>桌台金額：</Text>
              <Text style={styles.value}>80,000元</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>商品金額：</Text>
              <Text style={styles.value}>20,000元</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>會員儲值：</Text>
              <Text style={styles.value}>20,000元</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>會員續費：</Text>
              <Text style={styles.value}>--</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.label}>助教金：</Text>
              <Text style={styles.value}>--</Text>
            </View>
          </View>

          {/* 營業趨勢圖表 */}
          <Text style={styles.sectionTitle}>營業趨勢</Text>
          <LineChart
            data={lineChartData}
            width={320}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#E3F2FD',
              backgroundGradientTo: '#E3F2FD',
              color: (opacity = 1) => `rgba(67, 160, 71, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />

          {/* 支付方式分布圖表 */}
          <Text style={styles.sectionTitle}>支付方式分析</Text>
          <PieChart
            data={pieChartData}
            width={320}
            height={220}
            chartConfig={{
              backgroundColor: '#FFF',
              backgroundGradientFrom: '#FFF',
              backgroundGradientTo: '#FFF',
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
    zIndex: 2, // Push it behind other content
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
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  date: { fontSize: 18, fontWeight: 'bold' },
  dateNav: { fontSize: 16, color: '#FF7043' },
  summaryBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { fontSize: 16, color: '#333' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#2C3E50' },
  analysisBox: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  chart: { marginVertical: 8, borderRadius: 10 },
});

export default ReportSummaryScreen;
