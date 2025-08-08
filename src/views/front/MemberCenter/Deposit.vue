<template>
  <div class="recharge">
    <div class="recharge__container">
      <h2 class="recharge__title">選擇儲值方案</h2>

      <div v-if="loading" class="recharge__loading">載入中...</div>

      <div v-else class="recharge__grid">
        <div
          v-for="item in rechargeOptions"
          :key="item.id"
          :class="[
            'recharge__card',
            { 'recharge__card--selected': selectedOptionId === item.id },
          ]"
          @click="handleSelect(item.id)"
        >
          <div class="recharge__card-content">
            <div v-if="item.tag" class="recharge__tag">{{ item.tag }}</div>
            <div class="recharge__option-amount">
              <template v-if="item.id === 'first_member'">
                贈送儲值金額 100元
              </template>
              <template v-else>
                儲值 {{ formatNumber(item.rechargeAmount) }} 元
              </template>
            </div>
            <div
              v-if="item.id !== 'first_member'"
              class="recharge__option-bonus"
            >
              送 {{ formatNumber(item.bonusAmount) }} 元
            </div>
            <div
              v-if="selectedOptionId === item.id"
              class="recharge__card-check"
            >
              ✓
            </div>
          </div>
        </div>
      </div>

      <button class="recharge__submit" @click="handleRecharge">儲值</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDialogStore } from '@/stores/dialogStore';
import { getUserUse, topUp } from '@/services/paymentService';
import { fetchRechargeStandards } from '@/services/rechargeStandardService';

const router = useRouter();
const dialog = useDialogStore();

const selectedOptionId = ref<string | number | null>(null);
const rechargeOptions = ref<any[]>([]);
const loading = ref(true);
const firstUse = ref(true);
const sendUse = ref(true);

const allFirstTimeOptions = [
  {
    id: 'first_recharge',
    rechargeAmount: 300,
    bonusAmount: 150,
    title: '首次儲值限定',
    tag: '首次儲值限定',
  },
  {
    id: 'first_member',
    rechargeAmount: 100,
    bonusAmount: 0,
    title: '首次會員優惠',
    tag: '首次會員優惠',
  },
];

const formatNumber = (num: number) => num.toLocaleString();

onMounted(async () => {
  try {
    const [rechargeData, userUseResp] = await Promise.all([
      fetchRechargeStandards(),
      getUserUse(),
    ]);

    const usedData = userUseResp?.data || {};
    firstUse.value = !usedData.firstUse;
    sendUse.value = !usedData.sendUse;

    const availableOptions = (rechargeData || [])
      .filter((item: any) => item.status === 'AVAILABLE')
      .sort((a: any, b: any) => b.rechargeAmount - a.rechargeAmount);

    const firstTimeAvailableOptions: any[] = [];
    if (!usedData.firstUse)
      firstTimeAvailableOptions.push(allFirstTimeOptions[0]);
    if (!usedData.sendUse)
      firstTimeAvailableOptions.push(allFirstTimeOptions[1]);

    rechargeOptions.value = [...firstTimeAvailableOptions, ...availableOptions];
  } catch (e) {
    dialog.openInfoDialog({
      title: '錯誤',
      message: '無法取得儲值方案，請稍後再試',
    });
  } finally {
  }
});

const handleSelect = (id: string | number) => {
  selectedOptionId.value = id;
};

const handleRecharge = async () => {
  const selected = rechargeOptions.value.find(
    (item) => item.id === selectedOptionId.value
  );
  if (!selected) {
    dialog.openInfoDialog({ title: '錯誤', content: '請選擇儲值金額' });
    return;
  }

  let isFirst = false;
  let sendType = 'dep';

  if (selected.id === 'first_recharge' && firstUse.value) {
    isFirst = true;
    sendType = 'dep';
  } else if (selected.id === 'first_member' && sendUse.value) {
    isFirst = true;
    sendType = 'send';
  }

  // 若為「首次會員送點」直接入帳
  if (selected.id === 'first_member' && sendUse.value) {
    try {
      await topUp({
        price: selected.rechargeAmount,
        payType: 1,
        point: selected.bonusAmount,
        isFirst,
        sendType,
      });
      router.push({
        path: '/payment-success',
        state: { totalAmount: selected.rechargeAmount },
      });
    } catch (err) {
      dialog.openInfoDialog({ title: '錯誤', message: '儲值失敗，請稍後再試' });
    }
    return;
  }

  // 其他導向付款頁
  router.push({
    path: '/payment',
    state: {
      type: 'recharge',
      totalAmount: selected.rechargeAmount,
      rechargeOption: {
        ...selected,
        isFirst,
        sendType,
      },
    },
  });
};
</script>

<style scoped lang="scss">
.recharge {
  max-width: 1080px;
  margin: 0 auto;
  padding: 4rem 2rem;

  &__container {
    max-width: 720px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
  }

  // ✅ 將原本 __option 改為 __card 支援新 class 名
  &__card {
    width: calc(50% - 0.5rem);
    min-height: 108px;
    border: 1px solid #f67943;
    border-radius: 8px;
    padding: 1rem 0.5rem;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-check {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 20px;
      color: #fff;
    }

    &--selected {
      background-color: #f67943;
      border-color: #f67943;

      .recharge__option-amount,
      .recharge__option-bonus {
        color: #fff;
      }

      .recharge__card-check {
        color: #fff;
      }
    }
  }

  &__option-amount {
    font-size: 16px;
    font-weight: bold;
    color: #f67943;
  }

  &__option-bonus {
    font-size: 14px;
    margin-top: 0.5rem;
    color: #f67943;
  }

  &__submit {
    margin: 2rem auto 1rem;
    padding: 0.75rem 3rem;
    background-color: #f67943;
    border-radius: 25px;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    border: none;
    cursor: pointer;
    display: block;

    &:hover {
      background-color: #d75c2f;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }

  &__loading {
    margin-top: 3rem;
    text-align: center;
  }
}
.recharge__tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #f67943;
  color: #fff;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}
.recharge__card-check {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 20px;
  color: #fff;
}
</style>
