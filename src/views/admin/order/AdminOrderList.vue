<template>
  <div class="admin-list">
    <h1 class="admin-list__title">訂單列表</h1>

    <!-- 查詢區 -->
    <div class="admin-list__filter">
      <input
        v-model="searchForm.orderId"
        placeholder="訂單編號"
        class="admin-list__input"
      />
      <input
        v-model="searchForm.customerName"
        placeholder="顧客姓名"
        class="admin-list__input"
      />
      <button @click="loadOrders" class="admin-list__button">查詢</button>
    </div>

    <!-- 批次更新狀態 -->
    <div class="admin-list__actions">
      <select v-model="selectedStatus" class="admin-list__input">
        <option disabled value="">選擇新狀態</option>
        <option
          v-for="option in statusOptions"
          :key="option.code"
          :value="option.code"
        >
          {{ option.label }}
        </option>
      </select>

      <button class="admin-list__button" @click="handleBatchUpdate">
        批次更新狀態
      </button>
    </div>

    <!-- 訂單列表 -->
    <div class="admin-list__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <table class="admin-list__table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="isAllSelected"
                />
              </th>
              <th>訂單編號</th>
              <th>金額</th>
              <th>訂單狀態</th>
              <th>付款狀態</th>
              <th>物流方式</th>
              <th>物流單號</th>
              <th>建立時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in currentPageItems" :key="order.id">
              <td>
                <input
                  type="checkbox"
                  :value="order.id"
                  v-model="selectedOrderIds"
                />
              </td>
              <td>{{ order.id }}</td>
              <td>${{ order.totalAmount.toFixed(2) }}</td>
              <td>{{ order.status }}</td>
              <td>{{ order.paymentStatus }}</td>
              <td>{{ order.shippingMethod }}</td>
              <td>{{ order.trackingNo || '' }}</td>
              <td>
                <DateFormatter
                  :date="order.createTime"
                  :format="'YYYY/MM/DD HH:mm:ss'"
                />
              </td>
              <td>
                <button
                  class="admin-list__action-btn"
                  @click="goToDetail(order.id)"
                >
                  查看
                </button>
                <button
                  class="admin-list__action-btn"
                  @click="goToDeliveryNote(order.id)"
                >
                  出貨單
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
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import DateFormatter from '@/components/common/DateFormatter.vue';
import {
  fetchOrderList,
  fetchUpdatableOrderStatusList,
  updateOrderStatusBatch,
} from '@/services/admin/adminOrderServices';

const router = useRouter();
const selectedOrderIds = ref<string[]>([]);
const selectedStatus = ref('');

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

const statusOptions = ref<{ code: string; label: string }[]>([]);
const searchForm = ref({
  orderId: '',
  customerName: '',
});

// 查詢訂單
const loadOrders = async () => {
  const res = await fetchOrderList(searchForm.value);
  if (res.success) {
    list.value = res.data;
    selectedOrderIds.value = [];
  }
};

// 全選
const toggleSelectAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  selectedOrderIds.value = checked ? list.value.map((o) => o.id) : [];
};

const isAllSelected = computed(() => {
  return (
    list.value.length > 0 && selectedOrderIds.value.length === list.value.length
  );
});

// 跳轉
const goToDetail = (orderId: string) => {
  router.push(`/admin/orders/detail/${orderId}`);
};

const goToDeliveryNote = (orderId: string) => {
  router.push(`/admin/orders/delivery-note/${orderId}`);
};

// 批次更新狀態
const handleBatchUpdate = async () => {
  if (!selectedOrderIds.value.length) {
    return;
  }
  if (!selectedStatus.value) {
    return;
  }

  const updates = list.value
    .filter((o) => selectedOrderIds.value.includes(o.id))
    .map((o) => ({
      orderId: o.id,
      trackingNo: o.trackingNo || '',
      remark: o.remark || '',
    }));

  try {
    await updateOrderStatusBatch({
      updates,
      status: selectedStatus.value,
    });
    await loadOrders();
  } catch (err) {}
};

const loadStatusOptions = async () => {
  try {
    const res = await fetchUpdatableOrderStatusList();
    if (res.success) {
      statusOptions.value = res.data;
    }
  } catch (e) {
    console.error('載入狀態選項失敗', e);
  }
};

onMounted(() => {
  loadOrders();
  loadStatusOptions();
});
</script>
