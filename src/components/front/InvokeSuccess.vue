<template>
  <div class="invoke-success">
    <!-- 左上 LOGO 與標題 -->
    <header class="invoke-success__header">
      <Title color="white" text="擲杯請神" />
    </header>

    <!-- 主區塊 三欄 -->
    <div class="invoke-success__content">
      <!-- 左欄：祈求者 -->
      <div class="invoke-success__column invoke-success__column--left">
        <p class="invoke-success__text">信眾 {{ userName }}</p>
        <p class="invoke-success__text">求{{ godName }}賜福</p>
      </div>

      <!-- 中欄：神明圖像 -->
      <div class="invoke-success__column invoke-success__column--center">
        <div class="invoke-success__circle">
          <img :src="godBg" alt="背景" class="invoke-success__bg" />
          <img :src="godImage" :alt="godName" class="invoke-success__god" />
          <div class="invoke-success__god-name">{{ godName }}</div>
        </div>
      </div>

      <!-- 右欄：結果 -->
      <div class="invoke-success__column invoke-success__column--right">
        <p class="invoke-success__result-count">得聖筊 <span>3</span> 次</p>
        <p class="invoke-success__result-text">請神成功！</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Title from '@/components/common/Title.vue';
import { getProfile } from '@/services/UserService';
import { withLoading } from '@/utils/loadingUtils';
import godBg from '@/assets/image/god-bg-r.png';
const props = defineProps<{
  godImage: string;
  godName: string;
}>();

const userName = ref('');

// 取得會員暱稱
onMounted(async () => {
  try {
    const res = await withLoading(() => getProfile());
    if (res?.success) {
      userName.value = res.data?.nickName ?? '未知使用者';
    }
  } catch (e) {
    console.error('使用者資料載入失敗', e);
  }
});
</script>

<style scoped lang="scss">
.invoke-success {
  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__content {
    margin-top: 3rem;
    background: linear-gradient(to bottom, #b7381f, #cf4d2f);
    border-radius: 1.25rem;
    padding: 3rem 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  &__column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 260px;

    &--left,
    &--center,
    &--right {
      flex: 0 0 33%;
    }

    &--left {
      align-items: flex-start;
    }

    &--center {
      align-items: center;
      position: relative;
      margin: 1rem 0;
    }

    &--right {
      align-items: flex-end;
    }

    @media (max-width: 768px) {
      &--left,
      &--center,
      &--right {
        flex: 0 0 100%;
        align-items: center;
        text-align: center;
      }

      &--left {
        margin-bottom: 1.5rem;
      }

      &--right {
        margin-top: 1.5rem;
      }
    }
  }

  &__text {
    font-size: 20px;
    line-height: 1.6;
    color: white;
  }

  &__circle {
    width: 360px;
    height: 360px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    margin: 0 auto;
  }

  &__bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 0;
  }

  &__god {
    width: 160px;
    height: auto;
    margin-bottom: 0.5rem;
    z-index: 1;
  }

  @media (max-width: 768px) {
    &__circle {
      width: 260px;
      height: 260px;
    }

    &__god {
      width: 120px;
    }
  }

  &__god-name {
    font-size: 18px;
    font-weight: bold;
    color: white;
  }

  &__result-count {
    font-size: 20px;
    color: white;

    span {
      font-size: 32px;
      font-weight: bold;
      margin: 0 0.25rem;
    }
  }

  &__result-text {
    font-size: 28px;
    font-weight: bold;
    margin-top: 0.25rem;
    color: #ffd966;
  }
}
</style>
