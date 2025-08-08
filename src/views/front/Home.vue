<template>
  <section class="home-main">
    <!-- 卡片區 -->
    <div class="home-main__cards">
      <div
        class="card"
        v-for="item in cards"
        :key="item.title"
        @click="navigate(item.link)"
      >
        <!-- 上方橢圓按鈕 -->
        <div class="card__button">
          <i :class="item.icon" />
          <span>{{ item.title }}</span>
          <i class="fas fa-chevron-right card__arrow" />
        </div>
        <!-- 下方描述文字 -->
        <div class="card__desc">{{ item.desc }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const navigate = (link: string) => {
  router.push(link);
};

const cards = [
  {
    title: '門市探索',
    desc: '',
    icon: 'fas fa-store',
    link: '/store',
  },
  {
    title: '掃碼開台',
    desc: '掃描球桌上的 QRcode 開台/開燈',
    icon: 'fas fa-qrcode',
    link: '/scan',
  },

  {
    title: '預約開台',
    desc: '選擇門市預約開台',
    icon: 'fas fa-clock',
    link: '/bookStore',
  },
];
</script>

<style scoped lang="scss">
.home-main {
  padding: 2rem 1rem;
  color: white;

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
    }
  }
}

.card {
  background: #19174a;
  border-radius: 20px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: transform 0.2s ease;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 260px;
    height: 180px;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &__button {
    background: #ffc400;
    border-radius: 50px;
    padding: 0.6rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
    color: #000;
    font-size: 1rem;

    i {
      font-size: 1.1rem;
    }
  }

  &__desc {
    color: #00bfff;
    font-size: 0.85rem;
    margin-top: 1rem;
  }

  &__arrow {
    margin-left: auto;
  }
}
</style>
