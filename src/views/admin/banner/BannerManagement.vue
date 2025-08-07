<template>
  <div class="admin-list">
    <h1 class="admin-list__title">Banner 管理</h1>
    <button class="admin-list__add-btn" @click="goToAdd">新增 Banner</button>

    <div class="admin-list__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>類型</th>
              <th>標題</th>
              <th>圖片</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="banner in currentPageItems" :key="banner.id">
              <td>{{ getTypeLabel(banner.type) }}</td>
              <td>{{ banner.description || '（無描述）' }}</td>
              <td>
                <img
                  :src="banner.imageBase64"
                  :alt="banner.description || 'Banner'"
                  style="height: 40px"
                />
              </td>
              <td>
                <button @click="goToEdit(banner.id)">編輯</button>
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
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAdminBannerByType } from '@/services/admin/adminBannerServices';
import { withLoading } from '@/utils/loadingUtils';

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

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'A':
      return '主要';
    case 'B':
      return '會員好康';
    default:
      return '未知';
  }
};

const load = async () => {
  try {
    const [resA, resB] = await withLoading(() =>
      Promise.all([fetchAdminBannerByType('A'), fetchAdminBannerByType('B')])
    );

    const bannersA =
      resA.success && Array.isArray(resA.data)
        ? resA.data.map((b) => ({ ...b, type: 'A' }))
        : [];

    const bannersB =
      resB.success && Array.isArray(resB.data)
        ? resB.data.map((b) => ({ ...b, type: 'B' }))
        : [];

    list.value = [...bannersA, ...bannersB];
  } catch (error) {
    console.error('load banners error:', error);
  }
};

const goToAdd = () => router.push('/admin/banners/add');
const goToEdit = (id: number) => router.push(`/admin/banners/edit/${id}`);

onMounted(() => {
  load();
});
</script>
