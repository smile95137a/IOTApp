<template>
  <MCard>
    <div class="game-ongoing">
      <h2 class="memberCenter__title">開局進行中</h2>

      <NoData
        v-if="isFetched && transactions.length === 0"
        text="目前尚無進行中的紀錄"
      />

      <div v-else>
        <div
          v-for="item in transactions"
          :key="item.id"
          class="game-ongoing__item"
          @click="handleTransactionClick(item)"
        >
          <div class="game-ongoing__details">
            <div class="game-ongoing__store">{{ item.storeName }}</div>
            <div class="game-ongoing__table">{{ item.poolTableName }}</div>
          </div>
          <div class="game-ongoing__amount">
            NT <NumberFormatter :number="item.price" />
          </div>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MCard from '@/components/common/MCard.vue';
import NoData from '@/components/common/NoData.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { executeApi } from '@/utils/executeApiUtils';
import { fetchGameRecords } from '@/services/gameRecordService';

interface GameRecord {
  id: string;
  storeName: string;
  poolTableName: string;
  price: number;
}

const router = useRouter();
const transactions = ref<GameRecord[]>([]);
const isFetched = ref(false);

const loadTransactions = async () => {
  await executeApi({
    fn: () => fetchGameRecords(),
    onSuccess: async (data) => {
      isFetched.value = true;
      if (!data || data.length === 0) {
        transactions.value = [];
        throw new Error('目前尚無進行中的紀錄');
      }
      transactions.value = data;
    },
    onFail: (data) => {
      isFetched.value = true;
      transactions.value = [];
    },
  });
};

const handleTransactionClick = (item: GameRecord) => {
  router.push({ path: '/member-center/contact', state: { transaction: item } });
};

onMounted(() => {
  loadTransactions();
});
</script>

<style scoped lang="scss">
.game-ongoing {
  padding: 0 16px 32px;

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
    transition: background-color 0.2s;

    &:hover {
      background-color: #f9f9f9;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__store {
    font-size: 16px;
    color: #9e9e9e;
  }

  &__table {
    font-size: 16px;
    color: #333;
    margin-top: 6px;
  }

  &__amount {
    font-size: 16px;
    color: #e21a1c;
    text-align: right;
    white-space: nowrap;
  }

  &__no-data {
    text-align: center;
    color: #999;
    margin-top: 40px;
    font-size: 16px;
  }
}
</style>
