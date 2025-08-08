<template>
  <div class="payment">
    <h2 class="payment__title">付款資訊</h2>

    <div class="payment__order">
      <p class="payment__label">訂單內容：</p>
      <pre v-if="type === 'gameEnd'" class="payment__info">{{
        orderDetail
      }}</pre>
      <p v-else class="payment__info">
        {{
          type === 'recharge'
            ? '・ 儲值金額 '
            : '・ 球桌' +
              (type === 'game' || type === 'bookGame' ? '租金' : '費用')
        }}
        <NumberFormatter :number="finalAmount" />
        元
      </p>
      <p class="payment__total">
        總金額：
        <NumberFormatter :number="finalAmount" />
        元
      </p>
      <p v-if="type === 'gameEnd' && finalAmount < 0" class="payment__hint">
        未達球台租金，請點選任意結帳方式。
      </p>
    </div>

    <PaymentOptions :options="filteredMethods" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, h } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment';
import PaymentOptions from '@/views/front/MemberCenter/PaymentOptions.vue';
import NumberFormatter from '@/components/common/NumberFormatter.vue';

import { useDialogStore } from '@/stores/dialogStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { usePaymentStore } from '@/stores/paymentStore';

import { checkoutGameGamePay } from '@/services copy/frontend/gamePayService';
import { startGame, checkoutGame, bookGame } from '@/services/gameService';
import { topUp } from '@/services/paymentService';
import { executeApi } from '@/utils/executeApiUtils';

const router = useRouter();
const dialog = useDialogStore();
const authStore = useAuthFrontStore();
const paymentStore = usePaymentStore();

const type = paymentStore.type;
const payData = paymentStore.payData;
const rechargeOption = paymentStore.rechargeOption;
const finalAmount = ref<number>(paymentStore.totalAmount ?? 0);

onMounted(() => {
  if (!authStore.isLogin) {
    router.push('/login');
    return;
  }

  if (!type) {
    router.replace('/home');
    return;
  }

  if (type === 'gameEnd' && payData?.gameData) {
    finalAmount.value = payData.gameData.finalAmount ?? 0;
  }
});

const format2 = (val: any) => {
  const num = Number(val || 0);
  return num.toFixed(1);
};

const orderDetail = computed(() => {
  if (type !== 'gameEnd' || !payData?.gameData) return '';
  const {
    deposit = 0,
    discountPrice = 0,
    regularPrice = 0,
    totalPrice = 0,
    totalDiscountMinutes = 0,
    totalRegularMinutes = 0,
    discountHourlyRate,
    regularHourlyRate,
  } = payData.gameData;

  let detail = `・球台租金: -${format2(deposit)} 元(已支付)\n`;

  if (totalRegularMinutes > 0) {
    detail += `      一般時段(${
      format2(regularHourlyRate) || '-'
    }元/小時):${totalRegularMinutes} 分鐘，計 ${format2(regularPrice)} 元\n`;
  }

  if (totalDiscountMinutes > 0) {
    detail += `      優惠時段(${
      format2(discountHourlyRate) || '-'
    }元/小時):${totalDiscountMinutes} 分鐘，計 ${format2(discountPrice)} 元\n`;
  }

  detail += `・共計: ${format2(totalPrice)} 元\n`;
  return detail;
});

const handlePayment = async (label: string, payType: number) => {
  if (type === 'gameEnd' && finalAmount.value < 0) {
    await dialog.openInfoDialog({
      title: '提醒',
      message:
        '您好：\n因結帳金額未達球檯租金\n將返還至會員儲值金額帳戶內，提供下次使用。\n如需申請電子支付退款，請洽門店店長。感謝！',
    });
  }

  // 執行付款 API
  await executeApi({
    fn: async () => {
      if (type === 'game') {
        return await startGame({ poolTableUId: payData.uid, payType });
      } else if (type === 'gameEnd') {
        return await checkoutGame({
          payType,
          gameId: payData.gameId,
          poolTableId: payData.poolTableId,
        });
      } else if (type === 'recharge') {
        return await topUp({
          price: rechargeOption.rechargeAmount,
          payType,
          point: rechargeOption.bonusAmount,
          isFirst: rechargeOption.isFirst,
          sendType: rechargeOption.sendType,
        });
      } else if (type === 'payEnd') {
        return await checkoutGameGamePay({
          payType,
          gameId: payData.gameId,
          poolUId: payData.poolUId,
          totalPrice: payData.totalPrice,
        });
      } else if (type === 'bookGame') {
        const { poolTableUId, bookDate, selectedTime } = payData;
        const first = selectedTime[0];
        const last = selectedTime[selectedTime.length - 1];
        return await bookGame({
          poolTableUId,
          bookDate,
          payType,
          startTime: moment(
            `${bookDate} ${first.start}`,
            'YYYY-MM-DD HH:mm'
          ).format('YYYY/MM/DD HH:mm'),
          endTime: moment(`${bookDate} ${last.end}`, 'YYYY-MM-DD HH:mm').format(
            'YYYY/MM/DD HH:mm'
          ),
        });
      } else {
        return await startGame({ poolTableUId: payData.uid });
      }
    },
    onSuccess: (data) => {
      paymentStore.setSuccessData({
        type,
        showStartGame: type === 'game',
        totalAmount: finalAmount.value,
        data,
      });
      router.push('./payment-success');
    },
  });
};

const paymentMethods = [
  { label: '儲值金結帳', icon: 'wallet', payType: 1 },
  { label: '信用卡結帳', icon: 'credit-card', payType: 2 },
  { label: 'LINE PAY', icon: 'line', payType: 3 },
  { label: '街口支付', icon: 'lpay', payType: 4 },
  { label: 'Apple Pay', icon: 'apple', payType: 5 },
];

const filteredMethods = computed(() =>
  paymentMethods
    .filter((m) => !(type === 'recharge' && m.payType === 1))
    .map((method) => ({
      id: `${method.payType}`,
      icon: h('span', {
        class: `payment__icon payment__icon--${method.icon}`,
      }),
      title: method.label,
      onClick: () => handlePayment(method.label, method.payType),
    }))
);
</script>

<style lang="scss">
.payment {
  max-width: 1080px;
  margin: 32px auto;
  padding: 4rem 2rem;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 24px;
    text-align: center;
    color: #222;
  }

  &__order {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 32px;
    font-size: 16px;
    color: #444;
  }

  &__label {
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__info {
    white-space: pre-wrap;
    line-height: 1.6;
    margin-top: 8px;
    margin-bottom: 12px;
    color: #333;
  }

  &__total {
    font-size: 18px;
    font-weight: bold;
    color: #d32f2f;
    margin-top: 12px;
  }

  &__hint {
    margin-top: 12px;
    font-size: 14px;
    color: #d32f2f;
    font-weight: 500;
    background-color: #fff0f0;
    padding: 8px 12px;
    border-left: 4px solid #d32f2f;
    border-radius: 4px;
  }

  &__methods {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: center;
  }

  &__method {
    flex: 1 1 calc(50% - 16px);
    max-width: 240px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border: none;
    background-color: #ffe082;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: #ffd54f;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  @media (max-width: 768px) {
    padding: 16px;

    &__method {
      flex: 1 1 100%;
      max-width: 100%;
    }

    &__title {
      font-size: 20px;
    }

    &__total {
      font-size: 16px;
    }
  }
}
</style>
