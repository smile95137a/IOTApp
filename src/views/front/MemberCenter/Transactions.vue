<template>
  <MCard>
    <div class="transaction">
      <h2 class="memberCenter__title">消費紀錄</h2>

      <NoData
        v-if="isFetched && transactions.length === 0"
        text="目前尚無消費紀錄"
      />

      <div v-else>
        <div
          v-for="item in transactions"
          :key="item.id"
          class="transaction__item"
        >
          <div class="transaction__details">
            <div class="transaction__date">
              <DateFormatter :date="item.createdAt" format="YYYY.MM.DD HH:mm" />
            </div>
            <div class="transaction__location">
              {{ item.storeName }}
            </div>
            <div class="transaction__info">
              {{ item.tableNumber }}
            </div>
          </div>
          <div class="transaction__amount">
            NT <NumberFormatter :number="item.amount" />
          </div>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import moment from 'moment';
import NoData from '@/components/common/NoData.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import MCard from '@/components/common/MCard.vue';
import { executeApi } from '@/utils/executeApiUtils';
import { fetchUserTransactions } from '@/services/transactionService';

interface Transaction {
  id: string;
  createdAt: string;
  storeName: string;
  tableNumber: string;
  amount: number;
}

const transactions = ref<Transaction[]>([]);
const isFetched = ref(false);

const loadTransactions = async () => {
  await executeApi({
    fn: () => fetchUserTransactions(),
    onSuccess: (data) => {
      isFetched.value = true;
      transactions.value = [...data].sort((a, b) =>
        moment(b.createdAt, 'YYYY/MM/DD HH:mm:ss').diff(
          moment(a.createdAt, 'YYYY/MM/DD HH:mm:ss')
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
.transaction {
  padding: 0 16px;
  padding-bottom: 32px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  &__details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__date {
    font-size: 12px;
    color: #9e9e9e;
    margin-bottom: 4px;
  }

  &__location {
    font-size: 16px;
    color: #333;
    font-weight: 500;
  }

  &__info {
    font-size: 14px;
    color: #666;
    margin-top: 6px;
  }

  &__amount {
    font-size: 16px;
    font-weight: bold;
    color: #e21a1c;
    white-space: nowrap;
    text-align: right;
    min-width: 80px;
  }
}
</style>
