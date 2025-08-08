<template>
  <MCard>
    <div class="my-book-history">
      <h2 class="memberCenter__title">我的預約</h2>

      <NoData
        v-if="isFetched && transactions.length === 0"
        text="目前尚無預約紀錄"
      />

      <div v-else>
        <div
          v-for="item in transactions"
          :key="item.id"
          class="my-book-history__item"
          :class="{ 'my-book-history__item--active': item.status === 'BOOK' }"
          @click="item.status === 'BOOK' && handleBookAction(item)"
        >
          <div class="my-book-history__details">
            <div class="my-book-history__location">{{ item.storeName }}</div>
            <div class="my-book-history__info">{{ item.poolTableName }}</div>
            <div class="my-book-history__info">
              {{ item.startTime }} - {{ item.endTime }}
            </div>
          </div>
          <span :class="['my-book-history__status', statusClass(item.status)]">
            {{ statusLabel(item.status) }}
          </span>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MCard from '@/components/common/MCard.vue';
import NoData from '@/components/common/NoData.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { getBookGameList, bookStart, cancelBook } from '@/services/gameService';
import { getUserInfo } from '@/services/UsersService';
import { executeApi } from '@/utils/executeApiUtils';

interface GameTransactionRecord {
  id: string;
  storeName: string;
  poolTableName: string;
  poolTableId: string;
  gameId: string;
  startTime: string;
  endTime: string;
  status: 'BOOK' | 'COMPLETE' | 'CANCEL' | string;
}

const transactions = ref<GameTransactionRecord[]>([]);
const isFetched = ref(false);
const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();

const loadTransactions = async () => {
  await executeApi({
    fn: getBookGameList,
    onSuccess: (data) => {
      isFetched.value = true;
      transactions.value = [...data].sort(
        (a, b) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    },
    onFail: () => {
      transactions.value = [];
      isFetched.value = true;
    },
  });
};

const refreshUser = async () => {
  await executeApi({
    fn: getUserInfo,
    onSuccess: (data) => {
      authStore.setUser(data);
    },
  });
};

const handleBookAction = async (item: GameTransactionRecord) => {
  const confirmed = await dialogStore.openConfirmDialog({
    title: '預約操作',
    message: '請選擇要對預約進行的操作',
    confirmText: '開台（開始遊戲）',
    cancelText: '取消預約',
  });

  if (confirmed) {
    await handleBookStart(item);
  } else {
    await handleBookCancel(item);
  }
};

const handleBookStart = async (item: GameTransactionRecord) => {
  await executeApi({
    fn: () =>
      bookStart({
        gameId: item.gameId,
        poolTableId: item.poolTableId,
      }),
    onSuccess: async () => {
      await dialogStore.openInfoDialog({
        title: '成功',
        message: '遊戲已啟動',
      });
      loadTransactions();
    },
    onFail: (res) => {
      dialogStore.openInfoDialog({
        title: '錯誤',
        message: res.message || '開台失敗',
      });
    },
  });
};

const handleBookCancel = async (item: GameTransactionRecord) => {
  await executeApi({
    fn: () => cancelBook({ gameId: item.gameId }),
    onSuccess: async () => {
      await dialogStore.openInfoDialog({
        title: '已取消預約',
        message: '球桌租金已退回至贈送金額，請確認。',
      });
      loadTransactions();
      refreshUser();
    },
    onFail: (res) => {
      dialogStore.openInfoDialog({
        title: '錯誤',
        message: res.message || '取消失敗',
      });
    },
  });
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'BOOK':
      return '預約中';
    case 'COMPLETE':
      return '已完成';
    case 'CANCEL':
      return '已取消';
    default:
      return '未知狀態';
  }
};

const statusClass = (status: string) => {
  return `my-book-history__status--${status.toLowerCase()}`;
};

onMounted(() => {
  loadTransactions();
});
</script>

<style scoped lang="scss">
.my-book-history {
  padding-bottom: 32px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 15px 0;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;

    &--active {
      background-color: #f9f9f9;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  &__location {
    font-size: 16px;
    color: #333;
  }

  &__info {
    font-size: 14px;
    color: #666;
  }

  &__status {
    font-size: 14px;
    font-weight: bold;
    white-space: nowrap;
    &--book {
      color: #2196f3;
    }
    &--complete {
      color: #4caf50;
    }
    &--cancel {
      color: #f44336;
    }
    &--unknown {
      color: #9e9e9e;
    }
  }
}
</style>
