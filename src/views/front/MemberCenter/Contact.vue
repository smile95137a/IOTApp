<template>
  <div class="contact-screen">
    <div
      class="contact-screen__timer"
      :style="{
        backgroundColor: currentSlot?.isDiscount ? '#F67943' : '#00BFFF',
      }"
    >
      <div class="contact-screen__slot-list">
        <h3 class="contact-screen__slot-title">費率時段一覽</h3>
        <div class="contact-screen__slot-grid">
          <div
            v-if="mergedSlots.regular"
            :class="[
              'contact-screen__slot-card',
              currentSlot &&
                !currentSlot.isDiscount &&
                'contact-screen__slot-card--active',
            ]"
          >
            <div class="contact-screen__slot-header">
              <i class="fa fa-clock-o" />
              <span>一般</span>
            </div>
            <div class="contact-screen__slot-time">
              {{ formatTime(mergedSlots.regular.startTime) }} ~
              {{ formatTime(mergedSlots.regular.endTime) }}
            </div>
            <div class="contact-screen__slot-label">合併時段</div>
          </div>

          <div
            v-if="mergedSlots.discount"
            :class="[
              'contact-screen__slot-card',
              currentSlot &&
                currentSlot.isDiscount &&
                'contact-screen__slot-card--active',
            ]"
          >
            <div class="contact-screen__slot-header">
              <i class="fa fa-tag text-orange" />
              <span>優惠</span>
            </div>
            <div class="contact-screen__slot-time">
              {{ formatTime(mergedSlots.discount.startTime) }} ~
              {{ formatTime(mergedSlots.discount.endTime) }}
            </div>
            <div class="contact-screen__slot-label">合併時段</div>
          </div>
        </div>
      </div>

      <div class="contact-screen__timer-time">
        <span class="contact-screen__timer-label">球局已進行</span>
        <div class="contact-screen__time-box">{{ padded(hours) }}</div>
        <span class="contact-screen__timer-unit">小時</span>
        <div class="contact-screen__time-box">{{ padded(minutes) }}</div>
        <span class="contact-screen__timer-unit">分</span>
        <div class="contact-screen__time-box">{{ padded(seconds) }}</div>
        <span class="contact-screen__timer-unit">秒</span>
      </div>
    </div>

    <div class="contact-screen__contact">
      <div class="contact-screen__contact-icon">
        <button @click="handleCall">
          <div class="contact-screen__icon-circle">
            <i class="fa fa-phone" />
          </div>
          <div class="contact-screen__contact-title">聯絡加盟商</div>
        </button>
      </div>
      <div class="contact-screen__contact-text">
        <p>機台操作問題，請聯繫 {{ transaction?.vendorName }} 加盟商！</p>
        <p>聯絡資訊 {{ transaction?.storePhone }}</p>
      </div>
    </div>

    <div class="contact-screen__tips">
      <h4>溫馨提示：</h4>
      <p>{{ transaction?.hint }}</p>
    </div>

    <button class="contact-screen__end-button" @click="handleEndGame">
      結束球局
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import moment from 'moment';
import { useDialogStore } from '@/stores/dialogStore';
import { getGamePrice } from '@/services/gameService';
import { withLoading } from '@/utils/loadingUtils';
import { useTransactionStore } from '@/stores/transactionStore';
import { usePaymentStore } from '@/stores/paymentStore';

const route = useRoute();
const router = useRouter();
const dialog = useDialogStore();
const paymentStore = usePaymentStore();
const transactionStore = useTransactionStore();
const transaction = computed(() => transactionStore.transaction);
const elapsedTime = ref(0);
const currentSlot = ref<any>(null);
const mergedSlots = ref<any>({});

const hours = computed(() => Math.floor(elapsedTime.value / 3600));
const minutes = computed(() => Math.floor((elapsedTime.value % 3600) / 60));
const seconds = computed(() => elapsedTime.value % 60);

const padded = (val: number) => String(val).padStart(2, '0');
const formatTime = (t: string) => moment(t, 'HH:mm:ss').format('HH:mm');

onMounted(() => {
  if (!transaction.value) {
    router.replace('/home');
    return;
  }

  if (!transaction.value?.startTime || !transaction.value?.timeSlots) return;
  const startTime = moment(transaction.value.startTime, 'YYYY/MM/DD HH:mm:ss');

  const regular = transaction.value.timeSlots.filter((s) => !s.isDiscount);
  const discount = transaction.value.timeSlots.filter((s) => s.isDiscount);

  const getMinMax = (slots: any[]) => {
    if (!slots.length) return undefined;
    const start = moment.min(slots.map((s) => moment(s.startTime, 'HH:mm:ss')));
    const end = moment.max(slots.map((s) => moment(s.endTime, 'HH:mm:ss')));
    return {
      startTime: start.format('HH:mm:ss'),
      endTime: end.format('HH:mm:ss'),
    };
  };

  mergedSlots.value = {
    regular: getMinMax(regular),
    discount: getMinMax(discount),
  };

  const timer = setInterval(() => {
    const now = moment();
    elapsedTime.value = now.diff(startTime, 'seconds');
    currentSlot.value =
      transaction.value.timeSlots.find((slot: any) => {
        const start = moment(slot.startTime, 'HH:mm:ss');
        const end = moment(slot.endTime, 'HH:mm:ss');
        return now.isBetween(start, end, null, '[)');
      }) || null;
  }, 1000);

  return () => clearInterval(timer);
});

const handleCall = async () => {
  const phone = transaction.value?.storePhone;
  if (!phone)
    return dialog.openInfoDialog({ title: '錯誤', message: '找不到電話號碼' });
  const confirm = await dialog.openConfirmDialog({
    title: '撥打電話',
    message: `確定要撥打 ${phone} 嗎？`,
    confirmText: '撥打',
    cancelText: '取消',
  });
  if (confirm) window.location.href = `tel:${phone}`;
};

const handleEndGame = async () => {
  await withLoading(async () => {
    const { success, data, message } = await getGamePrice({
      gameId: transaction.value.gameId,
    });
    if (success) {
      paymentStore.type = 'gameEnd';
      paymentStore.totalAmount = data.totalPrice;
      paymentStore.payData = {
        gameId: transaction.value.gameId,
        poolTableId: transaction.value.poolTableId,
        gameData: data,
      };
      router.push('./payment');
    } else {
      dialog.openInfoDialog({
        title: '錯誤',
        message: message || '無法載入店家資訊',
      });
    }
  });
};
</script>

<style scoped lang="scss">
.contact-screen {
  padding: 1rem;

  &__timer {
    background-color: #00bfff;
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: #fff;
  }

  &__slot-list {
    margin-bottom: 1rem;
  }

  &__slot-title {
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  &__slot-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__slot-card {
    flex: 1 1 calc(50% - 0.5rem);
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &__slot-card--active {
    background-color: #fff9e6;
    border-color: #ffc107;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  &__slot-header {
    display: flex;
    align-items: center;
    font-weight: bold;
    margin-bottom: 0.25rem;

    i {
      margin-right: 0.5rem;
    }
  }

  &__slot-time {
    font-size: 0.9rem;
    color: #666;
  }

  &__slot-label {
    font-size: 0.8rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }

  &__timer-time {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  &__timer-label {
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }

  &__timer-unit {
    font-size: 0.8rem;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  &__time-box {
    width: 40px;
    height: 40px;
    background-color: #fff;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border-radius: 6px;
  }

  &__contact {
    display: flex;
    align-items: center;
    background-color: #f9f9f9;
    padding: 1rem;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }

  &__contact-icon {
    margin-right: 1rem;
    button {
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  &__icon-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #000;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  &__contact-title {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    color: #333;
  }

  &__contact-text {
    flex: 1;
    font-size: 0.9rem;
    color: #666;
  }

  &__tips {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;

    h4 {
      font-weight: bold;
      color: #333;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.9rem;
      color: #666;
    }
  }

  &__end-button {
    width: 100%;
    background-color: #ffc702;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
  }
}

.text-orange {
  color: #f67943;
}
</style>
