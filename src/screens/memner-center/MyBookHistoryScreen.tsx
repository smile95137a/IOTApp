import { GameTransactionRecord } from '@/api/transactionApi';
import NumberFormatter from '@/component/NumberFormatter';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

type ExtendedTransaction = GameTransactionRecord & {
  start: string;
  end: string;
  status: 'completed' | 'canceled';
};

const MyBookHistoryScreen = ({ navigation }: any) => {
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);

  useEffect(() => {
    const mockData: ExtendedTransaction[] = [
      {
        id: '1',
        storeName: '星辰撞球館',
        poolTableName: 'A 桌',
        price: 240,
        start: '2025/03/25 14:00',
        end: '2025/03/25 15:00',
        status: 'completed',
      },
      {
        id: '2',
        storeName: '快打球房',
        poolTableName: 'VIP 房',
        price: 400,
        start: '2025/03/20 19:00',
        end: '2025/03/20 21:00',
        status: 'canceled',
      },
      {
        id: '3',
        storeName: '三重撞球會館',
        poolTableName: '2 號桌',
        price: 320,
        start: '2025/03/18 13:30',
        end: '2025/03/18 14:30',
        status: 'completed',
      },
    ];

    setTransactions(mockData);
  }, []);

  const renderStatus = (status: 'completed' | 'canceled') => {
    switch (status) {
      case 'completed':
        return <Text style={styles.statusCompleted}>已結束</Text>;
      case 'canceled':
        return <Text style={styles.statusCanceled}>已取消</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.transactionList}>
      {transactions.map((item) => (
        <TouchableOpacity key={item.id}>
          <View style={styles.transactionItem}>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionLocation}>{item.storeName}</Text>
              <Text style={styles.transactionInfo}>{item.poolTableName}</Text>
              <Text style={styles.transactionInfo}>
                {item.start} - {item.end}
              </Text>
            </View>
            {renderStatus(item.status)}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  transactionList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  transactionDetails: {
    flex: 1,
    gap: 4,
  },
  transactionLocation: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  transactionInfo: {
    marginTop: 6,
    fontSize: 16,
  },
  statusCompleted: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'right',
  },
  statusCanceled: {
    fontSize: 16,
    color: '#E21A1C',
    textAlign: 'right',
  },
});

export default MyBookHistoryScreen;
