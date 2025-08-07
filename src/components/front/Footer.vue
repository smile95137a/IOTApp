<template>
  <footer class="the-footer">
    <div class="the-footer__line"></div>
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
import logoP from '@/assets/image/i-Pool_logo_RGB_2.png';
</script>
<style scoped lang="scss">
.the-footer {
  color: #fff;
  padding: 2rem 1rem;
  text-align: center;

  &__line {
    border-top: 2px solid #3baaff;
    margin-bottom: 1.5rem;
    max-width: 1080px;
    margin-left: auto;
    margin-right: auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 1.5rem;
    }
  }

  &__logo {
    height: 100px;
    margin-bottom: 0.8rem;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  &__text {
    font-size: 0.9rem;
    line-height: 1.4;
    color: #ddd;
  }
}
</style>
