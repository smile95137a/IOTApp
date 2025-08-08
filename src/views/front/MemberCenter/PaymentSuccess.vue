<template>
  <MCard>
    <div class="payment-success">
      <div class="payment-success__message">
        <h2 class="payment-success__title">付費成功！</h2>
        <div class="payment-success__divider" />
        <p class="payment-success__amount">
          <span class="payment-success__amount-label">總金額：</span>
          $<NumberFormatter :number="~~successData.totalAmount" /> 元
        </p>
      </div>
    </div>
  </MCard>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NumberFormatter from '@/components/common/NumberFormatter.vue';
import MCard from '@/components/common/MCard.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { usePaymentStore } from '@/stores/paymentStore';
import { getUserInfo } from '@/services/UsersService';

const router = useRouter();
const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();
const paymentStore = usePaymentStore();

const successData = paymentStore.successData;
if (!successData) {
  router.replace('/');
}

onMounted(async () => {
  try {
    const resp = await getUserInfo();
    if (resp.success) {
      authStore.setUser(resp.data);
    } else {
      console.warn('取得使用者資料失敗:', resp.message);
    }
  } catch (error: any) {
    if (error.isAutoLogout) return;
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: error.message || '發生錯誤',
    });
  }

  paymentStore.clear();
});
</script>
<style lang="scss">
.payment-success {
  padding: 4rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &__message {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 32px;
    text-align: center;
    max-width: 480px;
    width: 100%;
  }

  &__title {
    font-size: 26px;
    font-weight: bold;
    color: #f67943; // 主色橘
    margin-bottom: 16px;
  }

  &__divider {
    height: 2px;
    width: 60px;
    background-color: #f67943;
    margin: 0 auto 20px;
  }

  &__amount {
    font-size: 20px;
    color: #444;
    font-weight: 500;
  }

  &__amount-label {
    font-weight: bold;
    color: #999;
    margin-right: 4px;
  }

  &__action {
    margin-top: 32px;
    text-align: center;
  }

  &__start-button {
    padding: 12px 32px;
    background-color: #f67943;
    color: #fff;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: #ec6a2a; // 比主色稍深但不暗
    }

    &:active {
      transform: scale(0.98);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    &__message {
      padding: 24px;
    }

    &__title {
      font-size: 22px;
    }

    &__amount {
      font-size: 18px;
    }

    &__start-button {
      width: 100%;
      padding: 14px 0;
    }
  }
}
</style>
