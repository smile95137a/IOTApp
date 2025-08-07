<template>
  <header class="the-header">
    <div class="the-header__inner">
      <!-- Logo -->
      <div class="the-header__logo">
        <img :src="logoP" alt="iPool 享撞球" />
      </div>

      <!-- Desktop Nav -->
      <nav class="the-header__nav" v-if="!isMobile">
        <router-link
          v-for="item in navList"
          :key="item.text"
          :to="item.to"
          class="the-header__link"
        >
          <i :class="item.icon" /> {{ item.text }}
        </router-link>
      </nav>

      <!-- Mobile Hamburger -->
      <div class="the-header__hamburger" v-if="isMobile" @click="toggleMenu">
        <i class="fas fa-bars" />
      </div>
    </div>

    <!-- Slide-in Mobile Menu -->
    <transition name="slide">
      <div class="the-header__mobile-menu" v-if="isMobile && isMenuOpen">
        <router-link
          v-for="item in navList"
          :key="item.text"
          :to="item.to"
          class="the-header__mobile-link"
          @click="closeMenu"
        >
          <i :class="item.icon" /> {{ item.text }}
        </router-link>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import logoP from '@/assets/image/i-Pool_logo_RGB_2.png';
import { ref, onMounted, onUnmounted } from 'vue';

const navList = [
  { text: '首頁', icon: 'fas fa-home', to: '/' },
  { text: '最新消息', icon: 'fas fa-star', to: '/news' },
  { text: '儲值', icon: 'fas fa-dollar-sign', to: '/recharge' },
  { text: '門市探索', icon: 'fas fa-search', to: '/store-search' },
  { text: '會員', icon: 'fas fa-user', to: '/member' },
];

const isMenuOpen = ref(false);
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
const closeMenu = () => {
  isMenuOpen.value = false;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped lang="scss">
.the-header {
  border-bottom: 2px solid #3baaff;
  padding-bottom: 0.5rem;
  position: relative;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    position: relative;
  }

  &__logo img {
    height: 150px;
    margin-bottom: 1rem;
  }

  &__nav {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__link {
    color: white;
    font-size: 0.95rem;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;

    &:hover {
      color: #ffd700;
    }
  }

  &__hamburger {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 1.8rem;
    color: white;
    cursor: pointer;
  }

  &__mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 220px;
    height: 100vh;
    background-color: #2e56a1;
    display: flex;
    flex-direction: column;
    padding-top: 3.5rem;
    z-index: 999;

    .the-header__mobile-link {
      color: white;
      padding: 1rem 1.5rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0%);
}
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
