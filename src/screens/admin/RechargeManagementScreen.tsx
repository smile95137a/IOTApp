import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, Menu } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import HeaderBar from '../../component/admin/HeaderBar';
import {
  fetchAllRechargePromotions,
  deleteRechargePromotion,
} from '../../api/admin/rechargePromotionApi';
import {
  fetchAllRechargeStandards,
  deleteRechargeStandard,
} from '../../api/admin/rechargeStandardApi';
import { AppDispatch, RootState } from '../../store/store';
import { showLoading, hideLoading } from '../../store/loadingSlice';
import { useDialog } from '../../context/DialogContext';
import { getErrorMessage } from '../../utils/errorUtils';

const RechargeSettingManagementScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { openInfoDialog, openConfirmDialog } = useDialog();
  const user = useSelector((state: RootState) => state.user);
  const isSuperAdmin = user.user?.roles?.some((role) => role.id === 1);

  const [promotions, setPromotions] = useState<any[]>([]);
  const [standards, setStandards] = useState<any[]>([]);
  const [visibleMenuId, setVisibleMenuId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      dispatch(showLoading());
      const [res1, res2] = await Promise.all([
        fetchAllRechargePromotions(),
        fetchAllRechargeStandards(),
      ]);
      dispatch(hideLoading());

      if (res1.success) setPromotions(res1.data);
      if (res2.success) setStandards(res2.data);

      if (!res1.success || !res2.success) {
        await openInfoDialog({
          title: '錯誤',
          content:
            res1.message || res2.message || '載入資料時發生錯誤，請稍後再試',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  const handleDelete = async (
    type: 'standard' | 'promotion',
    id: number,
    name: string
  ) => {
    const confirmed = await openConfirmDialog({
      title: '確認刪除',
      content: `確定要刪除「${name}」嗎？`,
      confirmText: '刪除',
      cancelText: '取消',
    });

    if (!confirmed) return;

    try {
      dispatch(showLoading());
      const response =
        type === 'standard'
          ? await deleteRechargeStandard(id)
          : await deleteRechargePromotion(id);
      dispatch(hideLoading());

      if (response.success) {
        await openInfoDialog({ title: '成功', content: '刪除成功' });
        loadData();
      } else {
        await openInfoDialog({
          title: '錯誤',
          content: response.message || '刪除失敗',
        });
      }
    } catch (error: any) {
      if (error.isAutoLogout) return;
      dispatch(hideLoading());
      await openInfoDialog({
        title: '錯誤',
        content: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderBar title="儲值設定管理" showLeftButton />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.sectionTitle}>儲值標準</Text>
            <View style={styles.gridWrapper}>
              {standards.map((item) => (
                <View key={`standard-${item.id}`} style={styles.cardWrapper}>
                  <View style={styles.cardHeader}>
                    <TouchableOpacity
                      onPress={() =>
                        (navigation as any).navigate('AddRechargeStandard', {
                          standard: item,
                        })
                      }
                      style={{ flex: 1 }}
                    >
                      <Text style={styles.cardTitle}>方案：{item.name}</Text>
                      <Text style={styles.cardText}>
                        儲值金額：{item.rechargeAmount} 元
                      </Text>
                      <Text style={styles.cardText}>
                        送金額：{item.bonusAmount} 元
                      </Text>
                    </TouchableOpacity>
                    {isSuperAdmin && (
                      <Menu
                        visible={visibleMenuId === `standard-${item.id}`}
                        onDismiss={() => setVisibleMenuId(null)}
                        contentStyle={styles.menuStyle}
                        anchor={
                          <TouchableOpacity
                            onPress={() =>
                              setVisibleMenuId(`standard-${item.id}`)
                            }
                          >
                            <Icon name="dots-vertical" size={20} />
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item
                          onPress={() =>
                            (navigation as any).navigate(
                              'AddRechargeStandard',
                              {
                                standard: item,
                              }
                            )
                          }
                          title="編輯"
                          leadingIcon="pencil-outline"
                        />
                        <Menu.Item
                          onPress={() =>
                            handleDelete(
                              'standard',
                              item.id,
                              item.name || '此項目'
                            )
                          }
                          title="刪除"
                          leadingIcon="trash-can-outline"
                          titleStyle={{ color: 'red' }}
                        />
                      </Menu>
                    )}
                  </View>
                </View>
              ))}
              {isSuperAdmin && (
                <TouchableOpacity
                  style={styles.addCardWrapper}
                  onPress={() =>
                    (navigation as any).navigate('AddRechargeStandard')
                  }
                >
                  <Text style={styles.addCardText}>新增標準</Text>
                  <View style={styles.addIconWrapper}>
                    <Icon name="plus" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>儲值優惠</Text>
            <View style={styles.gridWrapper}>
              {promotions.map((item) => (
                <View key={`promotion-${item.id}`} style={styles.cardWrapper}>
                  <View style={styles.cardHeader}>
                    <TouchableOpacity
                      onPress={() =>
                        (navigation as any).navigate('AddRechargePromotion', {
                          promotion: item,
                        })
                      }
                      style={{ flex: 1 }}
                    >
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text style={styles.cardText}>
                        活動期間：{item.startDate || '-'} ~{' '}
                        {item.endDate || '-'}
                      </Text>
                      {item.details.map((detail: any) => (
                        <Text key={detail.id} style={styles.cardText}>
                          滿 {detail.rechargeAmount} 元 → 送{' '}
                          {detail.bonusAmount} 元
                        </Text>
                      ))}
                    </TouchableOpacity>
                    {isSuperAdmin && (
                      <Menu
                        visible={visibleMenuId === `promotion-${item.id}`}
                        onDismiss={() => setVisibleMenuId(null)}
                        contentStyle={styles.menuStyle}
                        anchor={
                          <TouchableOpacity
                            onPress={() =>
                              setVisibleMenuId(`promotion-${item.id}`)
                            }
                          >
                            <Icon name="dots-vertical" size={20} />
                          </TouchableOpacity>
                        }
                      >
                        <Menu.Item
                          onPress={() =>
                            (navigation as any).navigate(
                              'AddRechargePromotion',
                              {
                                promotion: item,
                              }
                            )
                          }
                          title="編輯"
                          leadingIcon="pencil-outline"
                        />
                        <Menu.Item
                          onPress={() =>
                            handleDelete('promotion', item.id, item.name)
                          }
                          title="刪除"
                          leadingIcon="trash-can-outline"
                          titleStyle={{ color: 'red' }}
                        />
                      </Menu>
                    )}
                  </View>
                </View>
              ))}
              {isSuperAdmin && (
                <TouchableOpacity
                  style={styles.addCardWrapper}
                  onPress={() =>
                    (navigation as any).navigate('AddRechargePromotion')
                  }
                >
                  <Text style={styles.addCardText}>新增優惠</Text>
                  <View style={styles.addIconWrapper}>
                    <Icon name="plus" size={20} color="#FFF" />
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  headerWrapper: { backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  cardText: { fontSize: 13, color: '#555' },
  addCardWrapper: {
    backgroundColor: '#FFC702',
    width: '48%',
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginBottom: 12,
  },
  addCardText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  addIconWrapper: {
    marginTop: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#595858',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuStyle: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
});

export default RechargeSettingManagementScreen;
