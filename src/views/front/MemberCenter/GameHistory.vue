<template>
  <MCard>
    <div class="game-history">
      <h2 class="memberCenter__title">開局記錄</h2>

      <NoData
        v-if="isFetched && transactions.length === 0"
        text="目前尚無開局紀錄"
      />

      <div v-else class="game-history__list">
        <div
          v-for="item in transactions"
          :key="item.id"
          class="game-history__item"
          @click="handleTransactionClick(item)"
        >
          <div class="game-history__details">
            <div class="game-history__date">
              {{ item.startTime }} - {{ item.endTime }}
            </div>
            <div class="game-history__label">{{ item.gameOrderName }}</div>
            <div
              class="game-history__status"
              :style="{ color: getStatusInfo(item.status).color }"
            >
              {{ getStatusInfo(item.status).label }}
            </div>
          </div>
          <div class="game-history__amount">
            NT <NumberFormatter :number="item.totalPrice" />
          </div>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import MCard from '@/components/common/MCard.vue';
import NoData from '@/components/common/NoData.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { executeApi } from '@/utils/executeApiUtils';
import { fetchGameOrders } from '@/services/gameOrderService';

interface GameOrder {
  id: string;
  status: string;
  gameOrderName: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  poolTableUid: string;
  gameId: string;
}

const router = useRouter();

const transactions = ref<GameOrder[]>([]);
const isFetched = ref(false);

const getStatusInfo = (status: string): { label: string; color: string } => {
  switch (status) {
    case 'NO_PAY':
      return { label: '未付款', color: '#9E9E9E' };
    case 'IS_PAY':
      return { label: '已付款', color: '#4CAF50' };
    case 'CANCEL':
      return { label: '已取消', color: '#F44336' };
    default:
      return { label: '未知狀態', color: '#9E9E9E' };
  }
};

const handleTransactionClick = (item: GameOrder) => {
  if (item.status !== 'NO_PAY') return;
  router.push({
    path: '/payment',
    query: {
      type: 'payEnd',
      gameId: item.gameId,
      poolUId: item.poolTableUid,
      totalPrice: item.totalPrice.toString(),
    },
  });
};

const loadTransactions = async () => {
  await executeApi({
    fn: () => fetchGameOrders(),
    onSuccess: (data) => {
      isFetched.value = true;
      transactions.value = [...data].sort((a, b) =>
        moment(b.startTime, 'YYYY/MM/DD HH:mm:ss').diff(
          moment(a.startTime, 'YYYY/MM/DD HH:mm:ss')
        )
      );
    },
    onFail: () => {
      transactions.value = [];
    },
  });
};

onMounted(() => {
  loadTransactions();
});
</script>

<style scoped lang="scss">
.game-history {
  padding-bottom: 32px;

  &__list {
    display: flex;
    flex-direction: column;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 15px 0;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__date {
    font-size: 12px;
    color: #9e9e9e;
    margin-bottom: 5px;
  }

  &__label {
    font-size: 16px;
    color: #9e9e9e;
  }

  &__status {
    font-size: 16px;
    margin-top: 6px;
    font-weight: bold;
  }

  &__amount {
    font-size: 16px;
    color: #e21a1c;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
