<template>
  <div class="admin-list">
    <h1 class="admin-list__title">商品列表</h1>

    <div class="admin-list__toolbar">
      <button class="admin-list__add-btn" @click="goToAdd">新增商品</button>
    </div>

    <table class="admin-list__table">
      <thead>
        <tr>
          <th>主圖</th>
          <th>商品名稱</th>
          <th>副標題</th>
          <th>售價</th>
          <th>原價</th>
          <th>狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in currentPageItems" :key="item.id">
          <td>
            <img
              v-if="item.mainImageUrl"
              :src="getImageUrl(item.mainImageUrl)"
              alt="商品主圖"
              class="admin-list__image"
            />
            <span v-else>—</span>
          </td>
          <td>{{ item.name || '-' }}</td>
          <td>{{ item.subtitle || '-' }}</td>
          <td>{{ item.specialPrice ?? '-' }}</td>
          <td>{{ item.originalPrice ?? '-' }}</td>
          <td>{{ item.status ? '啟用' : '停用' }}</td>
          <td>
            <button @click="goToEdit(item.id)">編輯</button>
            <button @click="goToAdjustStock(item.id)">庫存調整</button>
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
  </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/common/Pagination.vue';
import { usePagination } from '@/hook/usePagination';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProductList } from '@/services/admin/adminProductServices';
import { withLoading } from '@/utils/loadingUtils';
import { getImageUrl } from '@/utils/ImageUtils';
import { useDialogStore } from '@/stores/dialogStore';

const router = useRouter();
const dialogStore = useDialogStore();

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
  const res = await withLoading(() => getProductList({}));
  if (res.success && Array.isArray(res.data)) {
    list.value = res.data;
  }
};

const goToAdd = () => router.push('/admin/mall/items/add');
const goToEdit = (id: number) => router.push(`/admin/mall/items/edit/${id}`);
const goToAdjustStock = async (productId: string) => {
  const result = await dialogStore.openStockAdjustDialog(productId);
  if (result === true) {
    load(); // 更新商品列表
  }
};
onMounted(load);
</script>
<style scoped lang="scss">
.admin-list {
  &__image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  }
}
</style>
