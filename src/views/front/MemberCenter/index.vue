<template>
  <div class="member-center">
    <div class="member-center__header">
      <h2 class="member-center__title">會員中心</h2>

      <div class="member-center__info">
        <img class="member-center__avatar" :src="avatarUrl" alt="avatar" />
        <div class="member-center__meta">
          <h3 class="member-center__name">{{ user?.name || '未登入' }}</h3>
          <p>儲值金額：{{ formatNumber(userBalance) }}（消費優先扣除）</p>
          <p>贈送：{{ formatNumber(userSliver) }}</p>
          <p>可用餘額：{{ formatNumber(userBonus) }}</p>
        </div>
      </div>
    </div>

    <div v-if="showHeader" class="member-center__card">
      <div class="member-center__grid">
        <div
          v-for="(item, index) in menuList"
          :key="index"
          class="member-center__item"
          @click="goTo(item)"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import boyAvatar from '@/assets/image/iot-boy.png';
import girlAvatar from '@/assets/image/iot-girl.png';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { getUserInfo } from '@/services/UsersService';
import { getImageUrl } from '@/utils/ImageUtils';

const router = useRouter();
const route = useRoute();
const authStore = useAuthFrontStore();

const user = computed(() => authStore.user);
const userBalance = computed(() => authStore.user?.amount || 0);
const userSliver = computed(() => authStore.user?.point || 0);
const userBonus = computed(() => authStore.user?.balance || 0);

const showHeader = computed(() => route.path === '/member-center');

const goTo = (value: { route?: string; action?: string }) => {
  if (value.action === 'logout') {
    handleLogout();
  } else if (value.route) {
    router.push(value.route);
  }
};

const handleLogout = () => {
  authStore.clearAuthData();
  router.replace('/login');
};

const menuList = [
  { label: '編輯會員', icon: 'fas fa-pen', route: '/member-center/edit' },
  {
    label: '訊息通知',
    icon: 'fas fa-comment-alt',
    route: '/member-center/notifications',
  },
  {
    label: '消費記錄',
    icon: 'fas fa-calendar-alt',
    route: '/member-center/transactions',
  },
  {
    label: '儲值記錄',
    icon: 'fas fa-wallet',
    route: '/member-center/deposit-history',
  },
  {
    label: '開局進行中',
    icon: 'fas fa-play-circle',
    route: '/member-center/games-in-progress',
  },
  {
    label: '開局記錄',
    icon: 'fas fa-history',
    route: '/member-center/game-history',
  },
  {
    label: '儲值',
    icon: 'fas fa-dollar-sign',
    route: '/member-center/deposit',
  },
  {
    label: '我的預約',
    icon: 'fas fa-clock',
    route: '/member-center/reservations',
  },
  {
    label: '登出',
    icon: 'fas fa-sign-out-alt',
    action: 'logout',
  },
];

const avatarUrl = computed(() => {
  if (user.value?.imgUrl) return getImageUrl(user.value.imgUrl);
  return user.value?.gender === 'female' ? girlAvatar : boyAvatar;
});

const formatNumber = (num: number) => num.toLocaleString();

const fetchUser = async () => {
  const { success, data } = await getUserInfo();
  if (success) {
    authStore.setUser(data);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<style scoped lang="scss">
.member-center {
  padding: 2rem;
  min-height: 100vh;

  &__title {
    text-align: center;
    font-size: 2rem;
    color: #00ccff;
  }

  &__header {
    text-align: center;
    margin-bottom: 2rem;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: #ffcc00;
    font-size: 0.95rem;
    line-height: 1.6;

    .member-center__name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 0.5rem;
    }
  }

  &__card {
    background: #fff;
    color: #333;
    border-radius: 10px;
    padding: 1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    gap: 20px;

    &:hover {
      background: #f0f0f0;
    }

    i {
      color: #333;
    }

    span {
      flex: 1;
    }
  }

  @media (max-width: 768px) {
    &__info {
      flex-direction: column;
      text-align: center;
    }

    &__grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
