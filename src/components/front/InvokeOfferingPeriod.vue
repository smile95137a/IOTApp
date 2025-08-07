<template>
  <header class="invoke-success__header">
    <Title color="red" text="供奉神明" />
  </header>
  <section class="offering-period">
    <p class="offering-period__description">
      只添一點香油錢，就能將神明請至你的會員首頁及供奉大廳坐鎮<br />
      為你守護好運，還能抽好運籤讓請神明開示唷！
    </p>

    <div class="offering-period__cards">
      <div
        class="offering-period__card"
        v-for="option in options"
        :key="option.days"
      >
        <img
          class="offering-period__corner offering-period__corner--tl"
          alt="corner top"
          :src="menuDecoTop"
        />
        <img
          class="offering-period__corner offering-period__corner--br"
          alt="corner bottom"
          :src="menuDecoBottom"
        />

        <div class="offering-period__info">
          <span class="offering-period__label">供奉</span>
          <span class="offering-period__days">{{ option.days }}</span>
          <span class="offering-period__unit">日</span>
        </div>

        <div class="offering-period__price">NT${{ option.price }}</div>

        <button class="offering-period__button" @click="onExtendClick(option)">
          我要供奉 <i class="fa-solid fa-chevron-right arrow"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Title from '@/components/common/Title.vue';
import menuDecoBottom from '@/assets/image/menu-deco-bottom.png';
import menuDecoTop from '@/assets/image/menu-deco-top.png';
import { godDescend } from '@/services/GodService';
import { useOfferStore } from '@/stores/offerStore';
import { useRouter } from 'vue-router';
import { useDialogStore } from '@/stores/dialogStore';
import { executeApi } from '@/utils/executeApiUtils';
import { submitPaymentForm } from '@/utils/paymentUtils';
import { getProfile } from '@/services/UserService';

const offerStore = useOfferStore();
const dialogStore = useDialogStore();
const router = useRouter();

const options = [
  { days: 7, price: 200 },
  { days: 30, price: 800 },
];

const onExtendClick = async (option: { days: number; price: number }) => {
  const god = offerStore.selectedGod;

  const res = await dialogStore.openPaymentMethodDialog();
  const resProfile = await getProfile();

  if (resProfile.data.invoice == null) {
    const goToProfile = await dialogStore.openConfirmDialog({
      title: '尚未填寫發票資訊',
      message: '您尚未填寫發票資訊，是否前往會員中心補填？',
      confirmText: '前往填寫',
      cancelText: '取消',
    });

    if (goToProfile) {
      router.push('/member-center/memberProfile');
    }
    return;
  }
  if (!res?.code) {
    await dialogStore.openInfoDialog({
      title: '尚未選擇付款方式',
      message: '請選擇付款方式後再送出',
    });
    return;
  }

  const payload = {
    godCode: god.imageCode,
    day: option.days,
    paymentMethod: res.code,
  };

  await executeApi({
    fn: () => godDescend(payload),
    successTitle: '成功',
    errorTitle: '錯誤',
    onSuccess: (data) => {
      offerStore.setGodInvoked(true);
      if (res.code === 'credit_card') {
        submitPaymentForm({
          sendType: '0',
          orderNumber: data.externalPaymentNo,
          totalAmount: data.price,
          buyerMemo: '供俸 - 信用卡付款',
          returnUrl: `${window.location.origin}/paymentCBGod`,
        });
      }
    },
  });
};
</script>

<style scoped lang="scss">
.offering-period {
  background-color: #fff;
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  color: #111;
  &__info {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  &__label {
    font-size: 18px;
    line-height: 1;
    color: #111;
  }

  &__days {
    font-size: 48px;
    font-weight: bold;
    line-height: 1;
    color: #111;
  }

  &__unit {
    font-size: 18px;
    line-height: 1;
    color: #111;
  }
  &__description {
    font-size: 18px;
    line-height: 1.7;
    margin-bottom: 2rem;
    color: #311e1a;
  }

  &__cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  &__card {
    position: relative;
    border: 1px solid #c9a79d;
    border-radius: 12px;
    width: calc(50% - 1rem); // 修改為兩欄佈局
    padding: 2rem 1.5rem;
    text-align: center;
    background: #fff;

    @media (max-width: 768px) {
      width: 100%; // 手機全寬
    }
  }

  &__corner {
    position: absolute;
    width: 32px;
    height: 32px;
    &--tl {
      top: 1rem;
      right: 1rem;
    }
    &--br {
      bottom: 1rem;
      left: 1rem;
    }
  }

  &__info {
    font-size: 20px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    color: #111;
  }

  &__days {
    font-size: 48px;
    font-weight: bold;
  }

  &__price {
    font-size: 16px;
    color: #e4007f;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  &__button {
    background-color: #8b3a1e;
    color: #ffc20e;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-size: 16px;

    .arrow {
      margin-left: 0.5rem;
    }

    &:hover {
      background-color: #a84627;
    }
  }
}
</style>
