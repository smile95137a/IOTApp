<template>
  <div class="purchase-history">
    <h2 class="purchase-history__title">消費紀錄</h2>

    <!-- 查詢區 -->
    <div class="purchase-history__filter">
      <div class="purchase-history__filter-group">
        <label>起始時間</label>
        <input type="date" v-model="startDate" />
      </div>
      <div class="purchase-history__filter-group">
        <label>結束時間</label>
        <input type="date" v-model="endDate" />
      </div>
      <button class="purchase-history__btn" @click="handleSearch">查詢</button>
    </div>
    <template v-if="currentPageItems.length > 0">
      <!-- 資料表格 -->
      <table class="purchase-history__table">
        <thead>
          <tr>
            <th>日期</th>
            <th>項目</th>
            <th>內容</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in currentPageItems" :key="index">
            <td>{{ item.date }}</td>
            <td>{{ item.item }}</td>
            <td>{{ item.content }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 分頁 -->
      <div class="flex justify-center m-t-12">
        <Pagination
          :totalPages="totalPages"
          :renderPaginationNums="renderPaginationNums"
          :currentPage="currentPage"
          :nextPage="nextPage"
          :previousPage="previousPage"
          :goToPage="goToPage"
          :pageLimitSize="pageLimitSize"
          :totalItems="list.length"
          @update:pageLimitSize="pageLimitSize = $event"
        />
      </div>
    </template>
    <NoData v-else />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Pagination from '@/components/common/Pagination.vue';
import { usePagination } from '@/hook/usePagination';
import { getPurchaseRecord } from '@/services/UserService';
import moment from 'moment';
import NoData from '@/components/common/NoData.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { executeApi } from '@/utils/executeApiUtils';

const dialogStore = useDialogStore();

const startDate = ref(moment().subtract(7, 'days').format('YYYY-MM-DD'));
const endDate = ref(moment().format('YYYY-MM-DD'));

const list = ref<any[]>([]);
const pageLimitSize = ref(10);

const {
  totalPages,
  currentPageItems,
  renderPaginationNums,
  currentPage,
  nextPage,
  previousPage,
  goToPage,
} = usePagination<any>(list, pageLimitSize);

const handleSearch = async () => {
  if (moment(startDate.value).isAfter(endDate.value)) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: '開始日期不可晚於結束日期。',
    });
    return;
  }

  const payload = {
    startTime: moment(startDate.value).format('YYYY/MM/DD'),
    endTime: moment(endDate.value).format('YYYY/MM/DD'),
  };

  await executeApi({
    fn: () => getPurchaseRecord(payload),
    errorTitle: '錯誤',
    errorMessage: '查詢失敗，請稍後再試。',
    onSuccess: (data) => {
      list.value = data || [];
    },
    onFail: async (data) => {
      list.value = [];
      await dialogStore.openInfoDialog({
        title: '查詢失敗',
        message: data?.message || '查詢失敗，請稍後再試。',
      });
    },
  });
};
</script>

<style scoped lang="scss">
.purchase-history {
  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  &__filter {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    &-group {
      display: flex;
      flex-direction: column;

      label {
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
      }

      input[type='date'] {
        padding: 0.4rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 0.9rem;
      }
    }
  }

  &__btn {
    padding: 0.5rem 1.2rem;
    background-color: #b3442e;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #a53b25;
    }
  }
}
</style>
