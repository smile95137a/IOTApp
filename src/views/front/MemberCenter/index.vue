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

  /* ===== Header 區塊：深色保持 ===== */
  &__header {
    border-radius: 16px;
    padding: 2rem 1rem;
    text-align: center;
    margin-bottom: 2rem;
    color: #fff;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
  }

  &__title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #00ccff, #00ffcc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    border: 3px solid #00ccff;
    background: #fafafa;
    box-shadow: 0 0 12px rgba(0, 204, 255, 0.5);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #ffda5b;

    .member-center__name {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fff;
      margin-bottom: 0.5rem;
    }
  }

  /* ===== Card Grid 區塊 ===== */
  &__card {
    background: #f9f9f9; // 新增淡灰底
    padding: 1.5rem;
    margin-top: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr; // 手機單欄
    gap: 1rem;

    @media (min-width: 769px) {
      grid-template-columns: repeat(2, 1fr); // 桌機雙欄
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.2rem 1rem;
    border-radius: 14px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    gap: 0.6rem;

    &:hover {
      background: #fff;
      border: 1px solid transparent;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-4px);

      i {
        color: #00bcd4;
        transform: scale(1.15);
      }
    }

    i {
      font-size: 1.4rem;
      color: #555;
      transition: all 0.3s ease;
    }

    span {
      font-weight: 600;
      font-size: 0.95rem;
      color: #333;
    }
  }

  @media (max-width: 768px) {
    &__info {
      flex-direction: column;
      text-align: center;
    }
  }
}
</style>
