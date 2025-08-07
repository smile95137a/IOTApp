｀
<template>
  <section class="offering">
    <SectionBackground variant="red" />
    <div class="offering__container">
      <Title color="white" text="供奉大廳" />

      <div class="offering__temple">
        <div class="offering__main">
          <img class="offering__main-img" :src="tample" alt="" />
          <div class="offering__sign">
            {{ offerStore.selectedGod?.name || '' }}
          </div>

          <div v-if="offerStore.isGodInvoked" class="offering__god-image">
            <img
              :src="godImages[offerStore.selectedGod?.imageCode]?.default"
              :alt="offerStore.selectedGod?.name"
              class="offering__god-image-img"
            />
          </div>
          <div v-else class="offering__god-placeholder">請選擇供奉神明</div>
        </div>
      </div>

      <div class="offering__fruits">
        <div
          v-for="(item, index) in 3"
          :key="index"
          class="offering__fruit"
          @click="openOfferingDialog(index)"
        >
          <img class="offering__fruit-bowl" :src="fruitBowl" alt="fruit bowl" />
          <div
            v-if="offerings[index]"
            class="offering__fruit-image"
            @click.stop="handleOfferingClick(index)"
          >
            <img
              :src="offerings[index].imageBase64"
              alt="offering"
              class="offering__fruit-img"
            />
          </div>
          <div v-else class="offering__fruit-placeholder">供花供果</div>
        </div>
      </div>
      <div class="offering__confirm-wrap">
        <button
          class="offering__confirm-btn"
          @click="submitOfferings"
          :disabled="tempOfferingSelections.length === 0"
        >
          確認供奉
        </button>
      </div>

      <div class="offering__tabs">
        <button
          class="offering__tab"
          :class="{ 'offering__tab--active': currentTab === 'offer' }"
          @click="currentTab = 'offer'"
        >
          供奉神明
        </button>
        <button
          class="offering__tab"
          :class="{ 'offering__tab--active': currentTab === 'extend' }"
          @click="currentTab = 'extend'"
        >
          延長供奉
        </button>
      </div>
    </div>

    <!-- Tab content -->
    <div v-if="currentTab === 'offer'" class="offering__content">
      <p class="offering__content-title">請選擇供奉神明</p>
      <div class="offering__god-list">
        <div
          v-for="god in gods"
          :key="god.id"
          class="offering__god"
          @click="selectGod(god)"
        >
          <img
            :src="godImages[god.imageCode]?.default"
            :alt="god.imageCode"
            class="offering__god-icon"
          />
          <p class="offering__god-name">
            {{ godImages[god.imageCode]?.label || god.name }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="offering__content">
      <p class="offering__content-title">延長供奉內容區塊</p>
      <div class="offering__extend">
        <p class="offering__extend-title">請選擇延長供奉時間</p>
        <div class="offering__extend-options">
          <div
            class="offering__extend-option"
            v-for="item in extendOptions"
            :key="item.days"
          >
            <p class="offering__extend-days">
              <span class="offering__extend-number">{{ item.days }}</span> 天
            </p>
            <p class="offering__extend-price">NT${{ item.price }}</p>
            <button class="offering__extend-btn" @click="onExtendClick(item)">
              選擇 <i class="fa fa-arrow-right offering__extend-arrow"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
  fetchAllGod,
  getGodInfo,
  godDescend,
  presentOffering,
} from '@/services/GodService';
import { withLoading } from '@/utils/loadingUtils';
import godImages from '@/data/godImages';

import { useOfferStore } from '@/stores/offerStore';

import Title from '@/components/common/Title.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';

import tample from '@/assets/image/img-tample.png';
import fruitBowl from '@/assets/image/img-plate.png';
import { useDialogStore } from '@/stores/dialogStore';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { executeApi } from '@/utils/executeApiUtils';
import { submitPaymentForm } from '@/utils/paymentUtils';
import { getProfile } from '@/services/UserService';
import { useRouter } from 'vue-router';
const router = useRouter();
const offerStore = useOfferStore();
const dialogStore = useDialogStore();

const currentTab = ref<'offer' | 'extend'>('offer');
const gods = ref<any[]>([]);
const offerings = ref<any[]>([null, null, null]);
const loadedGodCode = ref<string | null>(null);

const extendOptions = [
  { days: 7, price: 200 },
  { days: 30, price: 800 },
];

const loadGods = async () => {
  await executeApi({
    fn: () => fetchAllGod(),
    onSuccess: (data) => {
      gods.value = data;
    },
  });
};

onMounted(() => {
  loadGods();
});

const fetchAndSetGodInfo = async (god: any) => {
  await executeApi({
    fn: () => getGodInfo({ godCode: god?.imageCode }),
    onSuccess: (data) => {
      if (data) {
        offerStore.setSelectedGod(data);
        offerStore.setGodInvoked(true);

        const godOfferings = data.offerings || [];
        for (let i = 0; i < 3; i++) {
          offerings.value[i] = godOfferings[i] || null;
        }
      } else {
        offerStore.setSelectedGod(god);
        offerStore.goToStep(2);
      }
    },
  });
};

const selectGod = async (god: any) => {
  await fetchAndSetGodInfo(god);
};

const handleOfferingClick = (index: number) => {
  const prevOfferingId = offerings.value[index]?.id || null;

  openOfferingDialog(index, prevOfferingId);
};

const onExtendClick = async (option: { days: number; price: number }) => {
  if (!offerStore.selectedGod) {
    await dialogStore.openInfoDialog({
      title: '尚未選擇神明',
      message: '請先選擇要延長供奉的神明',
    });
    return;
  }
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
    day: String(option.days), // 字串型別
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

const tempOfferingSelections = ref<{ index: number; data: any }[]>([]);

// 修改 openOfferingDialog：只暫存，不送出
const openOfferingDialog = async (
  index: number,
  prevOfferingId: string | null = null
) => {
  if (!offerStore.isGodInvoked) {
    await dialogStore.openInfoDialog({
      title: '提示',
      message: '請先選擇並成功請神明後，才能供奉供品',
    });
    return;
  }

  const res = await dialogStore.openPoeOfferingDialog();
  if (!res) return;

  offerings.value[index] = { imageBase64: res.imageBase64 };

  // 暫存選擇結果
  tempOfferingSelections.value = tempOfferingSelections.value.filter(
    (s) => s.index !== index
  );
  tempOfferingSelections.value.push({ index, data: res });
};

const submitOfferings = async () => {
  if (tempOfferingSelections.value.length === 0) return;
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

  const payRes = await dialogStore.openPaymentMethodDialog();
  if (!payRes?.code) {
    await dialogStore.openInfoDialog({
      title: '尚未選擇付款方式',
      message: '請選擇付款方式後再送出',
    });
    return;
  }

  const payload = {
    godCode: offerStore.selectedGod?.imageCode,
    paymentMethod: payRes.code,
    list: tempOfferingSelections.value.map((item) => ({
      index: item.index,
      newOfferingId: item.data.id,
    })),
  };

  await executeApi({
    fn: () => presentOffering(payload),
    successTitle: '供奉成功',
    errorTitle: '供奉失敗',
    onSuccess: (data) => {
      for (const item of tempOfferingSelections.value) {
        offerings.value[item.index] = {
          imageBase64: item.data.imageBase64,
        };
      }

      tempOfferingSelections.value = [];

      // 若為信用卡，轉導付款
      if (payRes.code === 'credit_card') {
        submitPaymentForm({
          sendType: '0',
          orderNumber: data.externalPaymentNo,
          totalAmount: data.price,
          buyerMemo: '供品 - 信用卡付款',
          returnUrl: `${window.location.origin}/paymentCBOffering`,
        });
      }
    },
  });
};

watch(
  () => offerStore.selectedGod?.imageCode,
  async (godCode) => {
    if (godCode && godCode !== loadedGodCode.value) {
      loadedGodCode.value = godCode;
      await fetchAndSetGodInfo(offerStore.selectedGod);
    }
  },
  { immediate: false }
);
</script>

<style lang="scss" scoped>
.offering {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo {
    width: 80px;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }

  &__temple {
    position: relative;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  &__main {
    width: 100%;
    height: 638px;
    max-width: 1200px;
    background-size: cover;
    position: relative;
    &-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform-origin: center;
      transition: transform 0.6s ease;
    }
  }

  &__sign {
    position: absolute;
    top: 140px;
    left: 50%;
    transform: translateX(-50%);
    background: #eeafa2;
    color: #000;
    padding: 0.25rem 1rem;
    border-radius: 4px;
    width: 142px;
    height: 52px;
    border: 3px solid #3c2313;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  &__god-placeholder {
    position: absolute;
    bottom: 132px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    border: 1px dashed #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    width: 178px;
    height: 152px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  &__steps {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__step {
    padding: 0.5rem 1.5rem;
    background: #fff;
    color: #b64832;
    border-radius: 20px;
    font-weight: bold;
    cursor: pointer;

    &--active {
      background: #df5b3c;
      color: #fff;
    }
  }

  &__gods {
    background: #ffe6e1;
    color: #000;
    padding: 1.5rem;
    border-radius: 12px;
  }

  &__gods-title {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  &__gods-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__god {
    background: #fff;
    border-radius: 8px;
    padding: 1rem;
    width: 100px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;

    &:hover {
      background: #ffd1c4;
    }
  }

  &__god-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 0.5rem;
  }

  &__god-name {
    font-size: 0.875rem;
    font-weight: bold;
  }
}
.offering__fruits {
  display: flex;
  justify-content: center;
  gap: 3rem;
  padding: 2rem 0;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 1200px;
    height: 64px;
    border-radius: 12px;

    background: #e0664d;
    z-index: 0;
  }
}

.offering__fruit {
  position: relative;
  width: 100%;
  max-width: 220px;
  height: 160px;

  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.offering__fruit-bowl {
  width: 160px;
  height: auto;
  z-index: 1;
}

.offering__fruit-placeholder {
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 178px;
  height: 120px;
  border: 1px dashed #ffffff;
  color: #fff;
  font-size: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;
}
.offering__tabs {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 2rem 0 0 0;
}

.offering__tab {
  position: relative;
  background: #eeafa2;
  color: #3c2313;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: all 0.3s;
  width: 100%;
  max-width: 180px;
  height: 44px;
  border-radius: 100px;
  font-size: 20px;
  opacity: 0.5;
  &--active {
    position: relative;
    opacity: 1;
    &::after {
      content: '';
      position: absolute;
      top: 56px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #ffe6e1; // 顏色與 tab 一致
    }
  }
}

.offering__content {
  background: #ffe6e1;
  padding: 2rem;
  text-align: center;
}

.offering__content-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.offering__god-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.offering__god {
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  width: 100px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  &:hover {
    background: #ffd1c4;
  }
}

.offering__god-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 0.5rem;
}

.offering__god-name {
  font-size: 0.875rem;
  font-weight: bold;
}
.offering__extend {
  text-align: center;
  padding: 2rem;

  &-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #000;
  }

  &-options {
    display: flex;
    justify-content: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  &-option {
    background: #fff;
    border-radius: 12px;
    padding: 1rem 2rem;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }

  &-days {
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;

    .offering__extend-number {
      font-size: 2rem;
      font-weight: 700;
    }
  }

  &-price {
    font-size: 1rem;
    color: #000;
  }

  &-btn {
    background: #b64832;
    color: #fff;
    font-weight: bold;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 999px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: #df5b3c;
    }
  }

  &-arrow {
    font-size: 1rem;
  }
}

.offering__god-image {
  position: absolute;
  bottom: 132px;
  left: 50%;
  transform: translateX(-50%);
  width: 178px;
  height: 152px;
  display: flex;
  align-items: center;
  justify-content: center;

  &-img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}
.offering__fruit-image {
  position: absolute;
  top: 0;
  width: 100%;
  max-width: 178px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  .offering__fruit-img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
}

.offering__confirm-wrap {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.offering__confirm-btn {
  background: #b64832;
  color: #fff;
  font-weight: bold;
  font-size: 18px;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover:not(:disabled) {
    background: #df5b3c;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
</style>
