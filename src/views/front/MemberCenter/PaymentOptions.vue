<template>
  <div class="payment-options">
    <div
      v-for="opt in options"
      :key="opt.id"
      class="payment-options__item"
      @click="opt.onClick"
    >
      <div class="payment-options__left">
        <div class="payment-options__icon">
          <component :is="opt.icon" />
        </div>
        <div class="payment-options__title">{{ opt.title }}</div>
      </div>
      <div class="payment-options__right">
        <span v-if="opt.rightText" class="payment-options__right-text">
          {{ opt.rightText }}
        </span>
        <i class="fas fa-chevron-right payment-options__chevron"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

export interface PaymentOption {
  id: string;
  icon: any;
  title: string;
  rightText?: string;
  onClick: () => void;
}

defineProps<{
  options: PaymentOption[];
}>();
</script>
<style lang="scss">
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); // ⭐ 加了陰影
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;

    &:hover {
      background-color: #f9f9f9;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12); // ⭐ 滑過更明顯
    }
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__right-text {
    font-size: 14px;
    color: #d40000;
  }

  &__chevron {
    color: #999;
  }
}
</style>
