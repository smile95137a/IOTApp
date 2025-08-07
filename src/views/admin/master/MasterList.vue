<template>
  <div class="admin-list">
    <h2 class="admin-list__title">老師清單</h2>
    <button class="admin-list__add-btn" @click="goToAdd">新增老師</button>

    <table class="admin-list__table">
      <thead>
        <tr>
          <th>名稱</th>
          <th>職稱</th>
          <th>主星</th>
          <th>啟用</th>
          <th>排序</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="item in currentPageItems" :key="item.code">
          <!-- 主列 -->
          <tr @click="toggleExpand(item.code)" class="admin-list__row">
            <td>{{ item.name }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.mainStar }}</td>
            <td>{{ item.status ? '是' : '否' }}</td>
            <td>{{ item.sort }}</td>
            <td>
              <button @click.stop="goToEdit(item.code)">編輯</button>
            </td>
          </tr>

          <!-- 明細列 -->
          <tr v-if="expandedCode === item.code">
            <td colspan="6" class="admin-list__details">
              <strong>簡介：</strong> {{ item.bio }}<br />
              <strong>經歷：</strong> {{ item.experience }}<br />
              <strong>隨身物品：</strong> {{ item.personalItems }}<br />
              <strong>服務項目：</strong>
              <ul>
                <li v-for="(service, idx) in item.serviceItem" :key="idx">
                  <strong>{{ service.title }}：</strong>{{ service.content }}
                </li>
              </ul>
            </td>
          </tr>
        </template>
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
import { fetchAllMasters } from '@/services/admin/adminMasterServices';
import { withLoading } from '@/utils/loadingUtils';

const router = useRouter();
const expandedCode = ref<string | null>(null);
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
    const res = await withLoading(() => fetchAllMasters());
    if (res.success && Array.isArray(res.data)) {
      list.value = res.data;
    }
  } catch (error) {
    console.error('load masters error:', error);
  }
};

const goToAdd = () => router.push('/admin/masters/add');
const goToEdit = (id: string) => router.push(`/admin/masters/edit/${id}`);

// 切換展開行
const toggleExpand = (code: string) => {
  expandedCode.value = expandedCode.value === code ? null : code;
};

onMounted(() => {
  load();
});
</script>
