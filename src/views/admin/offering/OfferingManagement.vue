<template>
  <div class="admin-list">
    <h1 class="admin-list__title">供品管理</h1>
    <button class="admin-list__add-btn" @click="goToAdd">新增供品</button>

    <div class="admin-list__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>名稱</th>
              <th>圖片</th>
              <th>點數</th>
              <th>金額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentPageItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>
                <img
                  v-if="item.imageBase64"
                  :src="item.imageBase64"
                  :alt="item.name"
                  style="height: 40px"
                />
                <span v-else>（無圖片）</span>
              </td>
              <td>{{ item.points }}</td>
              <td>{{ item.price }}</td>
              <td>
                <button @click="goToEdit(item.id)">編輯</button>
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
import { fetchOfferingList } from '@/services/admin/adminOfferingServices';
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

const load = async () => {
  try {
    const res = await withLoading(fetchOfferingList);
    if (res.success && Array.isArray(res.data)) {
      list.value = res.data;
    } else {
      list.value = [];
    }
  } catch (error) {
    console.error('load offerings error:', error);
    list.value = [];
  }
};

const goToAdd = () => router.push('/admin/offerings/add');
const goToEdit = (id: string) => router.push(`/admin/offerings/edit/${id}`);

onMounted(load);
</script>
