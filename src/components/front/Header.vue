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
        <i class="fas fa-bars" />
      </div>
    </div>

    <!-- Header Bottom Border Line -->
    <div class="the-header__line"></div>

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

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    position: relative;
  }

  &__logo {
    display: inline-block;
    cursor: pointer;

    img {
      height: 150px;
      margin-bottom: 1rem;
    }
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
    background-color: #3b5c95;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    z-index: 999;

    .the-header__mobile-link {
      color: white;
      padding: 1rem 1.5rem;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      border-bottom: 1px solid #01befe;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  &__line {
    border-bottom: 2px solid #3baaff;
    margin-top: 0.5rem;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
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
