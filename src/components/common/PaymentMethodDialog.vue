<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--paymentMethodDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="paymentMethodDialog">
      <SectionBackground variant="red" />
      <section class="payment">
        <p class="payment__title">請選擇付款方式</p>

        <div class="payment__list">
          <div
            v-for="method in paymentOptions"
            :key="method.code"
            class="payment__item"
            :class="{ 'payment__item--selected': selected === method.code }"
            @click="togglePayment(method.code)"
          >
            <i :class="getIconClass(method.code)" class="payment__item-icon" />
            <p class="payment__item-name">{{ method.name }}</p>
          </div>
        </div>

        <div class="payment__actions">
          <button
            class="payment__btn payment__btn--confirm"
            @click="submit"
            :disabled="!selected"
          >
            確認付款方式
          </button>
          <button
            class="payment__btn payment__btn--cancel"
            @click="handleClose(false)"
          >
            取消
          </button>
        </div>
      </section>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Dialog from './Dialog.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { getPayMethodList } from '@/services/OrderService';
const getIconClass = (code: string) => {
  const iconMap: Record<string, string> = {
    CREDIT: 'fas fa-credit-card',
    WALLET: 'fas fa-wallet',
    MOBILE: 'fas fa-mobile-alt',
    LINEPAY: 'fab fa-line',
    APPLEPAY: 'fab fa-apple',
    GOOGLEPAY: 'fab fa-google-pay',
  };
  return iconMap[code] || 'fas fa-credit-card';
};

const dialogStore = useDialogStore();
const isOpen = computed(() => dialogStore.isPaymentMethodDialogOpen);
const customClass = computed(() => dialogStore.customClass);

const selected = ref<string | null>(null);

const paymentOptions = ref([
  { code: 'credit_card', name: '信用卡', icon: 'fas fa-credit-card' },
]);

const togglePayment = (code: string) => {
  selected.value = selected.value === code ? null : code;
};

const submit = () => {
  if (!selected.value) return;
  const selectedItem = paymentOptions.value.find(
    (item) => item.code === selected.value
  );
  if (selectedItem) {
    dialogStore.closePaymentMethodDialog(selectedItem);
  }
};

const handleClose = (result: any) => {
  dialogStore.closePaymentMethodDialog(result);
};

const initOptions = async () => {
  try {
    const res = await getPayMethodList();
    if (res.success && Array.isArray(res.data)) {
      paymentOptions.value = res.data.map((p: any) => ({
        code: p.code,
        name: p.label,
        icon: p.icon,
      }));
    } else {
      console.warn('載入付款方式失敗:', res.message);
    }
  } catch (error) {
    console.error('取得付款方式失敗', error);
  }
};

// onMounted(initOptions);
</script>

<style scoped lang="scss">
.paymentMethodDialog {
  width: 100%;
}
.payment {
  padding: 40px 20px;
  text-align: center;
  color: #fff;

  &__title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 24px;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 32px;
  }

  &__item {
    background: #fff;
    color: #333;
    border-radius: 12px;
    padding: 1rem;
    width: 140px;
    cursor: pointer;
    transition: transform 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid transparent;

    &--selected {
      border-color: #df5b3c;
      background: #fff2ed;
    }

    &:hover {
      transform: scale(1.05);
    }
  }

  &__item-img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }

  &__item-name {
    font-size: 14px;
    font-weight: 600;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  &__btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 999px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;

    &--confirm {
      background-color: #8b3a1e;
      color: #ffc20e;

      &:hover {
        background-color: #a84627;
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    &--cancel {
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
