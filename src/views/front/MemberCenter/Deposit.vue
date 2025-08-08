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
  padding: 2rem;
  color: #333;

  &__container {
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #0088cc;
  }

  &__loading {
    text-align: center;
    font-size: 1rem;
    color: #999;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__card {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 1rem;
    background: #fff;
    cursor: pointer;
    position: relative;
    transition: 0.2s;

    &--selected {
      border-color: #00aaff;
      box-shadow: 0 0 0 2px #00aaff33;
    }
  }

  &__card-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
  }

  &__tag {
    background: #ffcc00;
    color: #000;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    border-radius: 4px;
    width: fit-content;
  }

  &__option-amount {
    font-weight: bold;
  }

  &__option-bonus {
    color: #00aa66;
    font-size: 0.95rem;
  }

  &__card-check {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    font-size: 1.25rem;
    color: #00aa88;
  }

  &__submit {
    display: block;
    width: 100%;
    padding: 0.75rem;
    background-color: #0088cc;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #0077b3;
    }
  }
}
</style>
