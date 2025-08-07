<template>
  <div class="invoke">
    <SectionBackground variant="divination" />
    <section class="invoke__container">
      <header class="god-selector__header">
        <Title :text="`擲杯請神`" color="white" />
      </header>
      <div class="invoke__main">
        <div class="invoke__content">
          <SectionBackground variant="red" />
          <div class="invoke__left">
            <p class="invoke__desc">請按「擲筊」，擲到 3 個聖筊即請神成功！</p>

            <div class="invoke__row-group">
              <div class="invoke__result">
                <p class="invoke__result-status" v-if="currentResult">
                  {{ getResultLabel(currentResult) }}
                </p>
                <img
                  v-if="currentResult"
                  :src="getCupImage(currentResult)"
                  alt="bwa"
                  class="invoke__result-img"
                />
              </div>

              <StartButton
                class="invoke__button invoke__button--inline"
                styleType="yellow"
                :label="
                  isThrowing
                    ? '擲筊中...'
                    : totalTries > 0
                    ? '擲筊'
                    : '次數已用完'
                "
                :disabled="isThrowing || totalTries === 0"
                @click="throwBwa"
              />
            </div>
          </div>

          <!-- 月老插圖 -->
        </div>
        <div class="invoke__right" v-if="selectedGodImage">
          <img
            :src="godBg"
            alt="背景插圖"
            class="invoke__right-img invoke__right-img--bg"
          />
          <img
            :src="selectedGodImage.default"
            alt="主神圖"
            class="invoke__right-img invoke__right-img--god"
          />
        </div>
      </div>

      <div class="invoke__stats">
        <!-- 剩餘擲筊次數 -->
        <div class="invoke__stat-card">
          <div class="invoke__stat-icon">
            <img :src="shengIcon" alt="空 icon" style="opacity: 0" />
          </div>
          <p class="invoke__stat-title invoke__stat-title--black">
            剩餘擲筊次數：
          </p>
          <p class="invoke__stat-value invoke__stat-value--black">
            {{ totalTries }}
          </p>
        </div>

        <!-- 擲中聖筊次數 -->
        <div class="invoke__stat-card">
          <div class="invoke__stat-icon">
            <img :src="shengIcon" alt="聖筊 icon" />
          </div>
          <p class="invoke__stat-title">擲中聖筊次數：</p>
          <p class="invoke__stat-value invoke__stat-value--red">
            {{ shengCount }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import bwaYin from '@/assets/image/bwa-yin.png';
import bwaXiao from '@/assets/image/bwa-xiao.png';
import bwaSheng from '@/assets/image/bwa-sheng.png';
import shengIcon from '@/assets/image/bwa-sheng.png';
import godBg from '@/assets/image/god-bg-r.png';
import SectionBackground from '@/components/common/SectionBackground.vue';
import StartButton from '@/components/front/StartButton.vue';
import Title from '@/components/common/Title.vue';
import { useOfferStore } from '@/stores/offerStore';
import godImages from '@/data/godImages';
import { withLoading } from '@/utils/loadingUtils';
import { godDescend } from '@/services/GodService';
import { useDialogStore } from '@/stores/dialogStore';

const MAX_TRIES = 3;
const offerStore = useOfferStore();
const dialogStore = useDialogStore();
const selectedGod = computed(() => offerStore.selectedGod);

const selectedGodImage = computed(() =>
  selectedGod.value?.imageCode ? godImages[selectedGod.value.imageCode] : null
);

const currentResult = ref('');
const totalTries = ref(MAX_TRIES);
const shengCount = ref(0);
const isThrowing = ref(false);

const throwBwa = () => {
  if (isThrowing.value || totalTries.value <= 0) return;

  isThrowing.value = true;
  setTimeout(async () => {
    const result = getRandomResult();
    currentResult.value = result;

    totalTries.value--;

    if (result === 'SHENG') {
      shengCount.value++;

      if (shengCount.value === 3) {
        setTimeout(async () => {
          offerStore.nextStep();
        }, 300);
      }
    }
    if (totalTries.value === 0 && shengCount.value < 3) {
      await dialogStore.openInfoDialog({
        title: '請神失敗',
        message: '您未擲出三個聖筊，請重新嘗試或返回上一頁。',
        confirmText: '我知道了',
      });
      offerStore.resetOfferProcess();
    }
    isThrowing.value = false;
  }, 300);
};

const getRandomResult = (): string => {
  const random = Math.floor(Math.random() * 100) + 1;
  if (random <= 5) return 'YIN';
  if (random <= 10) return 'XIAO';
  return 'SHENG';
};

const getResultLabel = (code: string): string => {
  if (code === 'YIN') return '陰筊';
  if (code === 'XIAO') return '笑筊';
  if (code === 'SHENG') return '聖筊';
  return code;
};

const getCupImage = (result: string) => {
  if (result === 'YIN') return bwaYin;
  if (result === 'XIAO') return bwaXiao;
  if (result === 'SHENG') return bwaSheng;
  return '';
};
</script>

<style scoped lang="scss">
.invoke {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__main {
    position: relative;
  }

  &__content {
    width: 100%;
    height: 330px;
    position: relative;
    padding: 16px;
    border-radius: 16px;
    overflow: hidden;
  }

  &__left {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__right {
    position: absolute;
    top: 50%;
    right: -126px;
    transform: translateY(-50%);
    width: 506px;
    height: 506px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__right-img {
    position: absolute;

    &--bg {
      inset: 0;
      z-index: 0;
    }

    &--god {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }
  }

  &__desc {
    font-size: 16px;
    margin-bottom: 32px;
    text-align: left;
    color: #fff;
  }

  &__row-group {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 32px;
    margin-bottom: 32px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
    }
  }

  &__result {
    display: flex;
    align-items: center;
    gap: 12px;
    width: auto;
    min-width: 180px;
    max-width: 100%;
    height: 205px;
    flex-shrink: 0;
  }

  &__result-status {
    font-family: Noto Sans TC;
    font-size: 40px;
    font-weight: bold;
    color: #ffd5c0;
    white-space: nowrap;
  }

  &__result-img {
    width: 100px;
    height: auto;
    object-fit: contain;
  }

  &__button {
    margin-top: 24px;

    &--inline {
      margin-top: 0;
    }
  }

  &__stats {
    display: flex;
    gap: 24px;
    margin-top: 32px;
    flex-wrap: wrap;
  }

  &__stat-card {
    display: flex;
    align-items: center;
    background: #fff;
    color: #a53b25;
    padding: 16px 24px;
    border-radius: 20px;
    min-width: 280px;
    height: 92px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    font-size: 16px;
    line-height: 1.4;
    column-gap: 12px;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__stat-icon img {
    width: 32px;
    height: 32px;
  }

  &__stat-title {
    white-space: nowrap;

    &--black {
      color: #000;
    }
  }

  &__stat-value {
    font-size: 24px;
    font-weight: bold;
    margin-left: auto;

    &--red {
      color: #a53b25;
    }

    &--black {
      color: #000;
    }
  }
}
</style>
