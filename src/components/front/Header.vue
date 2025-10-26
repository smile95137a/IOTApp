<template>
  <header class="the-header">
    <div class="the-header__inner">
      <!-- Logo -->
      <router-link to="/" class="the-header__logo">
        <img :src="logoP" alt="iPool 享撞球" />
      </router-link>

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
        <i class="fas fa-ellipsis-v" />
      </div>
    </div>

    <!-- Header Bottom Divider -->
    <div class="the-header__divider"></div>

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
import logoP from '@/assets/image/i-Pool_logo_RGB_3.png';
import { ref, onMounted, onUnmounted } from 'vue';

const navList = [
  { text: '首頁', icon: 'fas fa-home', to: '/' },
  { text: '最新消息', icon: 'fas fa-star', to: '/news' },
  { text: '儲值', icon: 'fas fa-dollar-sign', to: '/member-center/deposit' },
  { text: '門市探索', icon: 'fas fa-search', to: '/store' },
  { text: '會員', icon: 'fas fa-user', to: '/member-center' },
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
  position: relative;
  padding: 2rem 1rem;
  position: relative;
  padding: 2rem 1rem;

  &__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.8rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 767px) {
      justify-content: center;
    }
  }

  &__logo {
    img {
      height: 60px;
      width: auto;
      transition: transform 0.3s ease;

      @media (max-width: 767px) {
        height: 100px;
      }
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__nav {
    display: flex;
    gap: 2rem;
  }

  &__link {
    color: white;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    position: relative;
    transition: color 0.3s ease;

    &:hover {
      color: #ffd700;
    }

    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -6px;
      width: 0;
      height: 2px;
      background: #ffd700;
      transition: width 0.3s ease;
    }

    &:hover:after {
      width: 100%;
    }
  }

  &__hamburger {
    font-size: 1.8rem;
    color: #ffc400;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: background 0.3s ease;
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  &__mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 240px;
    height: 100vh;
    background: #243b66;
    display: flex;
    flex-direction: column;
    padding: 2rem 0;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.4);
    z-index: 999;

    .the-header__mobile-link {
      color: white;
      padding: 1rem 2rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      transition: background 0.3s ease, padding-left 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        padding-left: 2.5rem;
      }
    }
  }

  &__divider {
    border-bottom: 2px solid #01befe;
    margin-top: 0.3rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 767px) {
      display: none;
    }
  }
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s ease;
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
