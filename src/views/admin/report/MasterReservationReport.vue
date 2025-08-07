<template>
  <div class="admin-list">
    <h1 class="admin-list__title">老師預約報表</h1>

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

    <div class="admin-list__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>預約時間</th>
              <th>老師代碼</th>
              <th>會員姓名</th>
              <th>主題</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in currentPageItems" :key="r.serial">
              <td>{{ formatTime(r.createTime) }}</td>
              <td>{{ r.masterCode }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.service }}</td>
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
import { ref, onMounted } from 'vue';
import moment from 'moment';
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { fetchMasterReservationReport } from '@/services/admin/adminReportServices';

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

const formatTime = (val: string | null) => {
  return val ? moment(val).format('YYYY/MM/DD HH:mm') : '-';
};

const onSubmit = async () => {
  const res = await fetchMasterReservationReport({
    startTime: moment(startDate.value).format('YYYY/MM/DD'),
    endTime: moment(endDate.value).format('YYYY/MM/DD'),
  });
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
