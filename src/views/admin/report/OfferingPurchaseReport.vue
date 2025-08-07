<template>
  <div class="admin-list">
    <h1 class="admin-list__title">供品購買報表</h1>

    <!-- 查詢表單 -->
    <form class="admin-list__form" @submit.prevent="onSubmit">
      <input
        type="date"
        v-model="startDate"
        class="admin-list__input"
        required
      />
      <input type="date" v-model="endDate" class="admin-list__input" required />
      <button type="submit" class="admin-list__button">查詢</button>
    </form>

    <!-- 查詢結果 -->
    <div class="admin-list__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>時間</th>
              <th>項目</th>
              <th>內容</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in currentPageItems" :key="r.id">
              <td>
                <DateFormatter
                  :date="r.createTime"
                  :format="'YYYY/MM/DD HH:mm:ss'"
                />
              </td>
              <td>{{ r.offeringName }}</td>
              <td>{{ r.godName }}（{{ r.username }}）</td>
            </tr>
          </tbody>
        </table>

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
  </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { fetchOfferingPurchaseReport } from '@/services/admin/adminReportServices';
import { ref, onMounted } from 'vue';
import moment from 'moment';
import DateFormatter from '@/components/common/DateFormatter.vue';

const startDate = ref('');
const endDate = ref('');
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

const onSubmit = async () => {
  const payload = {
    startTime: moment(startDate.value).format('YYYY/MM/DD'),
    endTime: moment(endDate.value).format('YYYY/MM/DD'),
  };

  const res = await fetchOfferingPurchaseReport(payload);
  if (res.success) {
    list.value = res.data ?? [];
  } else {
    list.value = [];
  }
};

onMounted(() => {
  endDate.value = moment().format('YYYY-MM-DD');
  startDate.value = moment().subtract(7, 'days').format('YYYY-MM-DD');
  onSubmit();
});
</script>
