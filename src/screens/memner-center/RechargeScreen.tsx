import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { fetchRechargeStandards } from '../../api/rechargeApi';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { logJson } from '../../utils/logJsonUtils';

const RechargeScreen = ({ navigation }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [rechargeOptions, setRechargeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { openInfoDialog } = useDialog();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRechargeStandards();
        logJson('', data);
        const availableOptions = (data || [])
          .filter((item) => item.status === 'AVAILABLE')
          .sort((a, b) => a.rechargeAmount - b.rechargeAmount); // 加入這行排序
        setRechargeOptions(availableOptions);
      } catch (err) {
        await openInfoDialog({
          title: '錯誤',
          content: '無法取得儲值方案，請稍後再試',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedOptionId(id);
  };

  const handleRecharge = async () => {
    const selected = rechargeOptions.find(
      (item) => item.id === selectedOptionId
    );

    if (!selected) {
      await openInfoDialog({
        title: '錯誤',
        content: '請選擇儲值金額',
      });
      return;
    }

    navigation.navigate('Payment', {
      type: 'recharge',
      totalAmount: selected.rechargeAmount,
      rechargeOption: selected,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.optionContainer}>
          <View style={styles.optionGrid}>
            {rechargeOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.optionBox,
                  selectedOptionId === item.id && styles.selectedOption,
                ]}
                onPress={() => handleSelect(item.id)}
              >
                <Text
                  style={[
                    styles.amountText,
                    selectedOptionId === item.id && styles.selectedText,
                  ]}
                >
                  儲值 <NumberFormatter number={~~item.rechargeAmount} /> 元
                </Text>
                <Text
                  style={[
                    styles.bonusText,
                    selectedOptionId === item.id && styles.selectedText,
                  ]}
                >
                  送 <NumberFormatter number={~~item.bonusAmount} /> 元
                </Text>
                {selectedOptionId === item.id && (
                  <MaterialIcons
                    name="check"
                    size={24}
                    color="#FFFFFF"
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity style={styles.rechargeButton} onPress={handleRecharge}>
        <Text style={styles.rechargeButtonText}>儲值</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%', // 加這行讓內層能套滿整個螢幕
    backgroundColor: '#fff',
  },

  optionContainer: {
    width: '100%',
    padding: 16,
    flexGrow: 1,
  },

  optionGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionBox: {
    width: '48%',
    minHeight: 108,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F67943',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#F67943',
    borderColor: '#F67943',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F67943',
  },
  bonusText: {
    fontSize: 14,
    color: '#F67943',
    marginTop: 8,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  checkmark: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  rechargeButton: {
    backgroundColor: '#F67943',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 64,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },

  rechargeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default RechargeScreen;
