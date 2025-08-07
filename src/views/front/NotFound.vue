<template>
  <div class="notfound">
    <div class="notfound__container">
      <h1 class="notfound__title">404</h1>
      <p class="notfound__message">找不到你要的頁面</p>
      <RouterLink to="/" class="notfound__link">回首頁</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.notfound {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #fff7f4;

  &__container {
    padding: 24px;
  }

  &__title {
    font-size: 96px;
    font-weight: bold;
    margin-bottom: 16px;
    color: #eb6c4d; // 橘紅主色
  }

  &__message {
    font-size: 20px;
    margin-bottom: 24px;
    color: #3f2412;
  }

  &__link {
    font-size: 16px;
    color: #eb6c4d;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s;

    &:hover {
      border-color: #eb6c4d;
    }
  }
}
</style>
