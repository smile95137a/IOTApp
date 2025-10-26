<template>
  <footer class="the-footer">
    <!-- Footer Divider -->
    <div class="the-footer__divider"></div>

    <div class="the-footer__content">
      <img :src="logoP" alt="iPool 享撞球" class="the-footer__logo" />
      <div class="the-footer__text">
        <div>@2025 iPool All rights reserved</div>
        <div>享撞球 版權所有</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoP from '@/assets/image/i-Pool_logo_RGB_3.png';
</script>

<style scoped lang="scss">
.the-footer {
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;

  &__divider {
    border-top: 2px solid #01befe;
    margin-bottom: 1.5rem;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    @media (max-width: 767px) {
      display: none;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 2rem;
    }
  }

  &__logo {
    height: 70px;
    margin-bottom: 0.8rem;
    transition: transform 0.3s ease;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  &__text {
    font-size: 0.9rem;
    line-height: 1.6;
    color: #01befe;

    div {
      margin: 0.2rem 0;
      transition: color 0.3s ease;

      &:hover {
        color: #01befe;
      }
    }
  }
}
</style>
