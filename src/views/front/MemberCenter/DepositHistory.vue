<template>
  <MCard>
    <div class="deposit-history">
      <h2 class="memberCenter__title">儲值紀錄</h2>

      <NoData
        v-if="isFetched && transactions.length === 0"
        text="目前尚無儲值紀錄"
      />

      <div v-else class="deposit-history__list">
        <div
          v-for="item in transactions"
          :key="item.id"
          class="deposit-history__item"
        >
          <div class="deposit-history__details">
            <div class="deposit-history__date">
              <DateFormatter :date="item.createdAt" format="YYYY.MM.DD HH:mm" />
            </div>
            <div class="deposit-history__label">儲值紀錄</div>
            <div class="deposit-history__method">
              {{ getPayType(item.payType) }}
            </div>
          </div>
          <div class="deposit-history__amount">
            NT <NumberFormatter :number="item.amount" />
          </div>
        </div>
      </div></div
  ></MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import moment from 'moment';
import NoData from '@/components/common/NoData.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import { executeApi } from '@/utils/executeApiUtils';
import MCard from '@/components/common/MCard.vue';
import {
  fetchUserTransactionRecord,
  getPayType,
} from '@/services/transactionRecordService';
interface Transaction {
  id: string;
  createdAt: string;
  amount: number;
  payType: string;
}

const transactions = ref<Transaction[]>([]);
const isFetched = ref(false);

const loadTransactions = async () => {
  await executeApi({
    fn: () => fetchUserTransactionRecord(),
    onSuccess: (data) => {
      isFetched.value = true;
      transactions.value = [...data].sort((a, b) =>
        moment(b.createdAt, 'YYYY/MM/DD HH:mm:ss').diff(
          moment(a.createdAt, 'YYYY/MM/DD HH:mm:ss')
        )
      );
    },
    onFail: (data) => {
      transactions.value = [];
    },
  });
};

onMounted(() => {
  loadTransactions();
});
</script>

<style scoped lang="scss">
.deposit-history {
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

  &__method {
    font-size: 16px;
    margin-top: 6px;
    color: #212121;
  }

  &__amount {
    font-size: 16px;
    color: #e21a1c;
    text-align: right;
    white-space: nowrap;
  }
}
</style>
