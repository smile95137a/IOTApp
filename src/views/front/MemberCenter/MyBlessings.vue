<template>
  <div class="my-blessings">
    <!-- 區塊一：目前供奉中 -->
    <h2 class="my-blessings__title">我的供奉</h2>
    <table class="my-blessings__table" v-if="myGodInfo?.length">
      <thead>
        <tr>
          <th>目前供奉</th>
          <th>期間</th>
          <th>強化供品紀錄</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(god, index) in myGodInfo" :key="index">
          <td>
            <span class="my-blessings__link" @click="goToGod(god)">
              {{ god.godName }}
            </span>
          </td>
          <td>已供奉 {{ god.passDays }} 天，剩餘 {{ god.remainingDays }} 天</td>
          <td>
            <div
              v-for="(item, i) in god.offeringStates"
              :key="i"
              class="my-blessings__offering"
            >
              {{ item.buyTime }}　{{ item.id }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="text-gray">目前無供奉中神明</p>

    <!-- 區塊二：查詢供奉紀錄 -->
    <h2 class="my-blessings__title">查詢供奉紀錄</h2>
    <div class="my-blessings__filter">
      <div class="my-blessings__filter-group">
        <label>起始時間</label>
        <input type="date" v-model="startDate" />
      </div>
      <div class="my-blessings__filter-group">
        <label>結束時間</label>
        <input type="date" v-model="endDate" />
      </div>
      <button class="my-blessings__btn" @click="handleSearch">查詢</button>
    </div>
    <template v-if="currentPageItems.length > 0">
      <table class="my-blessings__table" v-if="currentPageItems.length > 0">
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

      <div class="flex justify-center m-t-12">
        <Pagination
          :totalPages="totalPages"
          :renderPaginationNums="renderPaginationNums"
          :currentPage="currentPage"
          :nextPage="nextPage"
          :previousPage="previousPage"
          :goToPage="goToPage"
          :pageLimitSize="pageLimitSize"
          :totalItems="recordList.length"
          @update:pageLimitSize="pageLimitSize = $event"
        />
      </div>
    </template>
    <NoData v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Pagination from '@/components/common/Pagination.vue';
import NoData from '@/components/common/NoData.vue';
import { usePagination } from '@/hook/usePagination';
import { useDialogStore } from '@/stores/dialogStore';
import { getOfferingRecord, getMyGodInfo } from '@/services/UserService';
import { getErrorMessage } from '@/utils/ErrorUtils';
import moment from 'moment';
import { executeApi } from '@/utils/executeApiUtils';
import godImages from '@/data/godImages';
import { useRouter } from 'vue-router';
const router = useRouter();

const dialogStore = useDialogStore();

const startDate = ref(moment().subtract(7, 'days').format('YYYY-MM-DD'));
const endDate = ref(moment().format('YYYY-MM-DD'));

const recordList = ref<any[]>([]);
const myGodInfo = ref<any>(null);

const pageLimitSize = ref(10);
const {
  totalPages,
  currentPageItems,
  renderPaginationNums,
  currentPage,
  nextPage,
  previousPage,
  goToPage,
} = usePagination<any>(recordList, pageLimitSize);

// 初始化目前供奉
const loadMyGodInfo = async () => {
  try {
    const res = await getMyGodInfo();
    if (res.success) {
      myGodInfo.value = res.data;
    } else {
      await dialogStore.openInfoDialog({
        title: '錯誤',
        message: res.message || '目前供奉查詢失敗',
      });
    }
  } catch (err) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: getErrorMessage(err),
    });
  }
};

// 查詢供奉紀錄
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
    fn: () => getOfferingRecord(payload),
    errorTitle: '錯誤',
    errorMessage: '查詢失敗，請稍後再試。',
    onSuccess: (data) => {
      recordList.value = data || [];
    },
  });
};

const goToGod = (god: any) => {
  const godKey = mapGodNameToKey(god.godName);
  if (godKey) {
    router.push({
      path: '/offeringHall',
      query: { god: godKey },
    });
  } else {
    dialogStore.openInfoDialog({
      title: '錯誤',
      message: `找不到神明「${god.godName}」的對應資料，請稍後再試。`,
    });
  }
};

const mapGodNameToKey = (godName: string): string => {
  const found = Object.entries(godImages).find(
    ([, value]) => value.label === godName
  );
  return found?.[0] || '';
};

onMounted(async () => {
  await loadMyGodInfo();
  await handleSearch();
});
</script>

<style scoped lang="scss">
.my-blessings {
  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 2rem 0 1rem;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
    margin-bottom: 2rem;

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
  &__link {
    color: #a53b25;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: #902e1c;
    }
  }
}
</style>
