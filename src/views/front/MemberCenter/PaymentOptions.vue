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
          <img
            class="payment-options__icon-img"
            :src="getIconUrl(opt.icon)"
            :alt="opt.icon"
          />
        </div>
        <div class="payment-options__title">{{ opt.title }}</div>
      </div>
      <div class="payment-options__right">
        <span v-if="opt.rightText" class="payment-options__right-text">
          {{ opt.rightText }}
        </span>
        <i class="fas fa-chevron-right payment-options__chevron"></i>
      </div>
      <img class="payment-options__bg" :src="iotPayBg" alt="bg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import iconWallet from '@/assets/image/iot-pay1.png';
import iconCreditCard from '@/assets/image/iot-credit-card.png';
import iconLinePay from '@/assets/image/iot-line-pay.png';
import iconJkoPay from '@/assets/image/iot-l-pay.png';
import iconApplePay from '@/assets/image/iot-apple-pay.png';
import iotPayBg from '@/assets/image/iot-pay-bg.png';

export interface PaymentOption {
  id: string;
  icon: string;
  title: string;
  rightText?: string;
  onClick: () => void;
}

const props = defineProps<{
  options: PaymentOption[];
}>();

const iconMap: Record<string, string> = {
  wallet: iconWallet,
  'credit-card': iconCreditCard,
  line: iconLinePay,
  lpay: iconJkoPay,
  apple: iconApplePay,
};

const getIconUrl = (key: string): string => {
  console.log(key);

  return iconMap[key] || '';
};
</script>

<style lang="scss">
.payment-options {
  position: relative; // ✅ 包含背景圖定位
  display: flex;
  flex-direction: column;
  gap: 12px;

  &__bg {
    position: absolute;
    right: 50px;
    bottom: -50px;
    width: 120px;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
  }

  &__item {
    position: relative;
    z-index: 1;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;

    &:hover {
      background-color: #f9f9f9;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
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

  &__icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
