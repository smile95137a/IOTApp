<template>
  <div class="admin-list">
    <h1 class="admin-list__title">物流方式管理</h1>

    <div class="admin-list__table-wrap">
      <template v-if="list.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>名稱</th>
              <th>說明</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentPageItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ item.description || '（無說明）' }}</td>
              <td>
                <button
                  class="admin-list__table-button admin-list__table-button--edit"
                  @click="goEdit(item.id)"
                >
                  編輯
                </button>
              </td>
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchShippingMethodList } from '@/services/admin/adminOrderServices';
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
const router = useRouter();
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
const load = async () => {
  const res = await fetchShippingMethodList();
  if (res.success) {
    list.value = res.data ?? [];
  } else {
    list.value = [];
  }
};

const goEdit = (id: string) => {
  router.push(`/admin/shipping-method/edit/${id}`);
};

onMounted(load);
</script>
