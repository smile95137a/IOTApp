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
import { getUserUse } from '../../api/paymentApi';
import NumberFormatter from '../../component/NumberFormatter';
import { useDialog } from '../../context/DialogContext';
import { logJson } from '../../utils/logJsonUtils';

const RechargeScreen = ({ navigation }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<
    number | string | null
  >(null);
  const [rechargeOptions, setRechargeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [firstUse, setFirstUse] = useState<boolean>(true);
  const [sendUse, setSendUse] = useState<boolean>(true);
  const { openInfoDialog } = useDialog();

  const allFirstTimeOptions = [
    {
      id: 'first_member',
      rechargeAmount: 100,
      bonusAmount: 100,
      title: '首次會員優惠',
      tag: '首次會員優惠',
    },
    {
      id: 'first_recharge',
      rechargeAmount: 300,
      bonusAmount: 150,
      title: '首次儲值限定',
      tag: '首次儲值限定',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rechargeData, userUseResp] = await Promise.all([
          fetchRechargeStandards(),
          getUserUse(),
        ]);

        logJson('userUseResp', userUseResp);
        const usedData = userUseResp?.data || {};

        setFirstUse(!usedData.firstUse);
        setSendUse(!usedData.sendUse);

        const availableOptions = (rechargeData || [])
          .filter((item) => item.status === 'AVAILABLE')
          .sort((a, b) => b.rechargeAmount - a.rechargeAmount);

        const firstTimeAvailableOptions = [];

        if (!usedData.firstUse) {
          firstTimeAvailableOptions.push(allFirstTimeOptions[0]); // first_member
        }

        if (!usedData.sendUse) {
          firstTimeAvailableOptions.push(allFirstTimeOptions[1]); // first_recharge
        }

        setRechargeOptions([...firstTimeAvailableOptions, ...availableOptions]);
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

  const handleSelect = (id: number | string) => {
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

    let isFirst = false;
    let sendType = 'dep';

    if (selected.id === 'first_member' && firstUse) {
      isFirst = true;
      sendType = 'send';
    } else if (selected.id === 'first_recharge' && sendUse) {
      isFirst = true;
      sendType = 'dep';
    }

    navigation.navigate('Payment', {
      type: 'recharge',
      totalAmount: selected.rechargeAmount,
      rechargeOption: {
        ...selected,
        isFirst,
        sendType,
      },
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
                {!!item.tag && <Text style={styles.tagLabel}>{item.tag}</Text>}
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
    width: '100%',
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
    position: 'relative',
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
  tagLabel: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#F67943',
    color: '#FFF',
    fontSize: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default RechargeScreen;
