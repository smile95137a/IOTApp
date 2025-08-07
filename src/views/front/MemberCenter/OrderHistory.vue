<template>
  <div class="order-history">
    <h2 class="order-history__title">訂單紀錄</h2>

    <!-- 篩選區 -->
    <div class="order-history__filter">
      <div class="order-history__filter-group">
        <label>起始時間</label>
        <input type="date" v-model="startDate" />
      </div>
      <div class="order-history__filter-group">
        <label>結束時間</label>
        <input type="date" v-model="endDate" />
      </div>
      <button class="order-history__btn" @click="handleSearch">查詢</button>
    </div>

    <!-- 資料區塊 -->
    <div class="order-history__table-wrap">
      <template v-if="currentPageItems.length > 0">
        <!-- 表格 -->
        <table class="order-history__table">
          <thead>
            <tr>
              <th>日期</th>
              <th>訂單編號</th>
              <th>內容</th>
              <th>狀態</th>
              <th>明細</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in currentPageItems" :key="index">
              <td>{{ item.date }}</td>
              <td>{{ item.orderId }}</td>
              <td style="white-space: pre-line">{{ item.content }}</td>
              <td>
                {{ item.status }}
                <br />
                <span style="font-size: 0.85em; color: #888"
                  >({{ item.paymentStatus }})</span
                >
              </td>
              <td>
                <button class="order-history__link" @click="openDialog(item)">
                  明細
                </button>
              </td>
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

    <!-- 明細 Dialog -->
    <div class="order-history__dialog-mask" v-if="showDialog">
      <div class="order-history__dialog">
        <h3 class="order-history__dialog-title">訂單明細</h3>
        <p><strong>訂單編號：</strong>{{ selectedItem.raw.id }}</p>
        <p><strong>下單時間：</strong>{{ selectedItem.date }}</p>
        <p><strong>金額：</strong>NT${{ selectedItem.raw.totalAmount }}</p>
        <p><strong>付款狀態：</strong>{{ selectedItem.raw.paymentStatus }}</p>
        <p><strong>物流方式：</strong>{{ selectedItem.raw.shippingMethod }}</p>
        <p><strong>訂單狀態：</strong>{{ selectedItem.raw.status }}</p>

        <div class="order-history__dialog-actions">
          <button class="order-history__btn" @click="showDialog = false">
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { getOrderList } from '@/services/OrderService';
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

const showDialog = ref(false);
const selectedItem = ref<any>({});

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
    fn: () => getOrderList(payload),
    errorTitle: '查詢失敗',
    errorMessage: '查詢失敗，請稍後再試。',
    onSuccess: (data) => {
      list.value = (data || []).map((item: any) => ({
        orderId: item.id,
        date: moment(item.createTime).format('YYYY/MM/DD HH:mm:ss'),
        content: `金額：NT$${item.totalAmount}\n物流：${item.shippingMethod}`,
        status: item.status,
        paymentStatus: item.paymentStatus,
        raw: item,
      }));
    },
    onFail: async (data) => {
      list.value = [];
    },
  });
};

const openDialog = (item: any) => {
  selectedItem.value = item;
  showDialog.value = true;
};
</script>

<style scoped lang="scss">
.order-history {
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
    background-color: #a53b25;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #902e1c;
    }
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;

    th,
    td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #ddd;
      vertical-align: top;
    }

    td {
      white-space: pre-line;
    }
  }

  &__link {
    background: none;
    border: none;
    padding: 0;
    color: #a53b25;
    text-decoration: underline;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
  }

  &__dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  &__dialog {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    max-width: 400px;
    width: 100%;
  }

  &__dialog-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  &__dialog-actions {
    margin-top: 1.5rem;
    text-align: right;
  }
}
</style>
