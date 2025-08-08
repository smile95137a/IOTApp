<template>
  <MCard>
    <div class="notifications">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="notifications__item"
      >
        <div>
          <p class="notifications__date">
            <DateFormatter :date="item.createdDate" format="YYYY.MM.DD" />
          </p>
          <p class="notifications__title">{{ item.title }}</p>
        </div>
        <button
          class="notifications__button"
          :class="
            item.isRead === '未讀'
              ? 'notifications__button--unread'
              : 'notifications__button--read'
          "
          @click="openNotification(item)"
        >
          <span class="notifications__button-icon">＋</span>
          {{ item.isRead === '未讀' ? '閱讀' : '已讀' }}
        </button>
      </div>

      <div v-if="selectedNotification" class="notifications__modal">
        <div class="notifications__modal-container">
          <h3 class="notifications__modal-title">
            <DateFormatter
              :date="selectedNotification.createdDate"
              format="YYYY.MM.DD"
            />
            {{ selectedNotification.title }}
          </h3>
          <div class="notifications__modal-content">
            <p>{{ selectedNotification.content }}</p>
          </div>
          <button class="notifications__modal-close" @click="closeNotification">
            ✕
            <span>關閉</span>
          </button>
        </div>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MCard from '@/components/common/MCard.vue';
import NoData from '@/components/common/NoData.vue';
import DateFormatter from '@/components/common/DateFormatter.vue';
import { getAllNews } from '@/services/newsService';
import { executeApi } from '@/utils/executeApiUtils';

interface Notification {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  isRead: string; // '未讀' | '已讀'
}

const notifications = ref<Notification[]>([]);
const selectedNotification = ref<Notification | null>(null);

const loadNotifications = async () => {
  await executeApi({
    fn: () => getAllNews(),
    onSuccess: (data) => {
      notifications.value = data || [];
    },
    onFail: () => {
      notifications.value = [];
    },
  });
};

const openNotification = (item: Notification) => {
  selectedNotification.value = item;
};

const closeNotification = () => {
  selectedNotification.value = null;
};

onMounted(() => {
  loadNotifications();
});
</script>

<style scoped lang="scss">
.notifications {
  padding: 20px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__date {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  &__button {
    padding: 10px 15px;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    &--unread {
      background-color: #f67943;
      color: #fff;
    }

    &--read {
      background-color: #ccc;
      color: #666;
    }

    &-icon {
      font-size: 16px;
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    &-container {
      background-color: #fff;
      width: 90%;
      max-width: 500px;
      max-height: 90%;
      border-radius: 15px;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: stretch; // ✅ 改為 stretch 解決寬度壓縮
    }

    &-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 15px;
      text-align: center;
    }

    &-content {
      font-size: 14px;
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
      max-height: 400px;
      overflow-y: auto;
    }

    &-close {
      border: 2px solid #f67943;
      color: #f67943;
      padding: 6px 18px;
      border-radius: 18px;
      font-weight: bold;
      font-size: 14px;
      background-color: transparent;
      cursor: pointer;
      display: flex;
      align-self: center; // 單獨置中按鈕
      align-items: center;
      gap: 6px;

      &:hover {
        background-color: #f67943;
        color: #fff;
      }
    }
  }
}
</style>
