<template>
  <MCard>
    <div class="recharge">
      <div class="recharge__container">
        <h2 class="recharge__title">選擇儲值方案</h2>

        <div class="recharge__grid">
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
    </div></MCard
  >
</template>

<script setup lang="ts">
import MCard from '@/components/common/MCard.vue';
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
  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr); // ✅ 手機版兩欄
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(
        auto-fill,
        minmax(220px, 1fr)
      ); // ✅ 電腦版自動塞滿
    }
  }

  &__card {
    width: 100%; // ✅ 由 grid 控制寬度
    min-height: 108px;
    border: 1px solid #f67943;
    border-radius: 8px;
    padding: 2rem 0.5rem;
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

  &__tag {
    position: absolute;
    top: 8px;
    left: 8px;
    background-color: #f67943;
    color: #fff;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 4px;
  }

  &__card-check {
    position: absolute;
    bottom: 8px;
    right: 8px;
    font-size: 20px;
    color: #fff;
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
