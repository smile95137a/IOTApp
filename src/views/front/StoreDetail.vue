<template>
  <div class="store-detail" v-if="store">
    <div class="store-detail__header">
      <img
        class="store-detail__logo"
        :src="getImageUrl(store.imgUrl)"
        alt="store"
      />
      <div class="store-detail__info">
        <h2 class="store-detail__title">{{ store.name }}</h2>
        <p class="store-detail__address">{{ store.address }}</p>
      </div>
    </div>
    <div class="store-pricing">
      <div class="store-pricing__label">
        <div class="label-line">時段</div>
        <div class="label-line">計費</div>
      </div>
      <div class="store-pricing__columns">
        <div class="store-pricing__column">
          <div class="price">{{ todayPricing?.regularRate * 60 }}元/小時</div>
          <div class="desc">一般時段</div>
          <div class="time">
            {{ currentRegularSlot?.startTime }}~
            {{ currentRegularSlot?.endTime }}
          </div>
        </div>
        <div class="store-pricing__column">
          <div class="price">{{ todayPricing?.discountRate * 60 }}元/小時</div>
          <div class="desc">優惠時段</div>
          <div class="time">
            {{ currentDiscountSlot?.startTime }}~
            {{ currentDiscountSlot?.endTime }}
          </div>
        </div>
      </div>
    </div>
    <div class="store-detail__card">
      <div class="store-detail__table-summary">
        <p>桌數：{{ tables.length }}桌</p>
        <p class="store__table-available">可用桌數：{{ available }}桌</p>
      </div>

      <div class="store-detail__table-grid">
        <div
          v-for="table in tables"
          :key="table.id"
          class="store-detail__table-item"
          @click="handleStartGame(table.uid)"
        >
          <img
            :src="getTableImg(table)"
            :alt="table.name"
            class="store-detail__table-img"
          />
          <div
            class="store-detail__table-btn"
            :class="{
              'store-detail__table-btn--yellow': isTableAvailable(table),
              'store-detail__table-btn--gray': !isTableAvailable(table),
            }"
          >
            {{ table.tableNumber }} {{ getTableLabel(table) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/ImageUtils';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import tableDisableImg from '@/assets/image/iot-table-disable.png';
import { fetchStoreByUid } from '@/services/storeService';
import { useDialogStore } from '@/stores/dialogStore';
import { fetchPoolTablesByStoreUid } from '@/services copy/frontend/poolTableService';
import { startGame } from '@/services/gameService';
import { executeApi } from '@/utils/executeApiUtils';
import { useAuthFrontStore } from '@/stores/authFrontStore';

const route = useRoute();
const router = useRouter();
const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();

const store = ref<any>(null);
const tables = ref<any[]>([]);
const todayPricing = ref<any>(null);
const currentRegularSlot = ref<any>(null);
const currentDiscountSlot = ref<any>(null);

const storeId = route.params.id as string;

const loadStore = async () => {
  await executeApi({
    fn: () => fetchStoreByUid(storeId),
    onSuccess: (data: any) => {
      store.value = data;
      const today = data.todayRes;
      console.log('today', data.todayRes);
      if (today) {
        const currentSlot = today.timeSlots?.[0];

        todayPricing.value = {
          regularRate: today.regularRate,
          discountRate: today.discountRate,
        };
        currentRegularSlot.value = {
          startTime: today.openTime,
          endTime: today.closeTime,
        };
        if (currentSlot) {
          currentDiscountSlot.value = {
            startTime: currentSlot.startTime,
            endTime: currentSlot.endTime,
          };
        }
      }
    },
  });
};

const loadTables = async () => {
  await executeApi({
    fn: () => fetchPoolTablesByStoreUid(storeId),
    onSuccess: (data) => {
      tables.value = data;
    },
  });
};

const available = computed(() => tables.value.filter((t) => !t.isUse).length);

const getTableImg = (table: any) => {
  return isTableAvailable(table) ? tableEnableImg : tableDisableImg;
};

const isTableAvailable = (table: any) => {
  return (
    !table.isUse && table.status !== 'FAULT' && table.status !== 'UNAVAILABLE'
  );
};

const getTableLabel = (table: any) => {
  if (table.status === 'FAULT' || table.status === 'UNAVAILABLE')
    return '設備維護中';
  if (table.isUse) return '開局進行中';
  return '立即開台';
};

const handleStartGame = async (poolTableUid: string) => {
  if (!authStore.isLogin) {
    dialogStore.openInfoDialog({
      title: '請先登入',
      message: '使用此功能前請先登入會員。',
      confirmText: '前往登入',
    });
    router.replace('/login');
    return;
  }
  const payType = 'game';

  await executeApi({
    fn: () => startGame({ poolTableUId: poolTableUid, payType }),
    onSuccess: (data) => {
      dialogStore.openInfoDialog({
        title: '系統訊息',
        message: '開局成功',
        confirmText: '我知道了',
      });
      router.push('/member-center/games-in-progress');
    },
  });
};

onMounted(() => {
  if (storeId) {
    loadStore();
    loadTables();
  }
});
</script>
<style scoped lang="scss">
.store-detail {
  max-width: 1080px;
  margin: 0 auto;
  padding: 4rem 2rem;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 32px;
  }

  &__logo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background-color: #f5f5f5;
    margin-right: 20px;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__title {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin: 0 0 6px;
  }

  &__address {
    font-size: 14px;
    color: #dcdcdc;
  }

  &__card {
    background: #fff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  &__table-summary {
    display: flex;
    justify-content: center;
    gap: 40px;
    font-size: 18px;
    font-weight: 700;

    .store__table-available {
      color: #2676e6;
    }
  }

  &__table-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(163px, 1fr));
    gap: 20px;
    justify-content: center;
    margin-top: 28px;
  }

  &__table-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

      .store-detail__table-img {
        filter: brightness(1.05);
      }
    }
  }

  &__table-img {
    width: 140px;
    height: 100px;
    object-fit: contain;
    border-radius: 8px;
  }

  &__table-btn {
    width: 100%;
    border-radius: 8px;
    padding: 10px 0;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    transition: background-color 0.25s ease, transform 0.25s ease;

    &--yellow {
      background: linear-gradient(90deg, #ffc400, #ffda5b);
      color: #000;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);
      animation: pulseYellow 2.5s infinite;

      &:hover {
        background: linear-gradient(90deg, #ffda5b, #ffe680);
        transform: scale(1.05);
      }
    }

    &--gray {
      background: #b0b0b0;
      color: #fff;
      opacity: 0.9;
    }
  }
}

.store-pricing {
  display: flex;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.15)
  );
  border-radius: 12px;
  padding: 24px;
  color: #fff;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin: 40px 0;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);

  // 進場動畫
  animation: fadeUp 0.6s ease-out;

  &__label {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    margin-right: 28px;
    font-weight: 500;
    line-height: 1.6;
    white-space: nowrap;
  }

  &__columns {
    display: flex;
    gap: 32px;
    align-items: center;
  }

  &__column {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-left: 28px;
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    text-align: center;
    position: relative;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    .price {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 6px;
      animation: glowPulse 2s infinite;
    }

    // 優惠價：紅色跳動
    &:nth-child(2) .price {
      color: #ff5252;
      animation: glowPulseRed 1.8s infinite;
    }

    .desc {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 4px;
    }

    .time {
      font-size: 13px;
      opacity: 0.75;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    align-items: stretch;
    padding: 20px;

    &__label {
      align-items: center;
      margin-right: 0;
      margin-bottom: 16px;
    }

    &__columns {
      flex-direction: column;
      gap: 20px;
    }

    &__column {
      border-left: none;
      padding-left: 0;
      border-top: 1px solid rgba(255, 255, 255, 0.4);
      padding-top: 16px;

      &:first-child {
        border-top: none;
        padding-top: 0;
      }
    }
  }
}

/* ===== 動畫效果 ===== */
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowPulse {
  0% {
    text-shadow: 0 0 5px rgba(255, 215, 64, 0.5);
  }
  50% {
    text-shadow: 0 0 15px rgba(255, 215, 64, 0.9);
  }
  100% {
    text-shadow: 0 0 5px rgba(255, 215, 64, 0.5);
  }
}

@keyframes glowPulseRed {
  0% {
    text-shadow: 0 0 6px rgba(255, 82, 82, 0.6);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 18px rgba(255, 82, 82, 1);
    transform: scale(1.1);
  }
  100% {
    text-shadow: 0 0 6px rgba(255, 82, 82, 0.6);
    transform: scale(1);
  }
}

@keyframes pulseYellow {
  0% {
    box-shadow: 0 0 6px rgba(255, 215, 64, 0.4);
  }
  50% {
    box-shadow: 0 0 14px rgba(255, 215, 64, 0.8);
  }
  100% {
    box-shadow: 0 0 6px rgba(255, 215, 64, 0.4);
  }
}
</style>
