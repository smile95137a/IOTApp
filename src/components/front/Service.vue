<template>
  <section class="service">
    <SectionBackground variant="red" />
    <div class="service__container">
      <div class="service__wrapper">
        <!-- 求籤問事區塊 -->
        <div class="service__block">
          <Title text="求籤問事" color="light" />
          <p class="service__desc">
            當您面臨人生抉擇、事業困境、情感糾葛或靈平靜時，古老的智慧可為您指明方向。
            線上求籤猶如與冥冥中的力量對話，透過千年傳承的靈驗籤詩，為您揭示吉凶徵兆。
            每支籤文皆蘊含深遠智慧，為您的課題提供靈解答案。無論何時何地，只要您懷著真誠的心，虔心求問，便能獲得上天的啟示，找到生命中的答案。
          </p>
          <div class="service__img-wrap">
            <img alt="插圖" :src="divinationIntro" class="service__main-img" />
          </div>
          <div class="service__button-wrap">
            <StartButton
              styleType="yellow"
              label="前往求籤問事"
              @click="goToDivination"
            />
          </div>
        </div>

        <!-- 請神供奉區塊 -->
        <div class="service__block">
          <Title text="請神供奉" color="light" />
          <p class="service__desc">
            虛心供奉，神明庇佑。線上請神供奉系統讓您足不出戶即能表達敬意與祈願。
            選擇心儀神明如月老助姻緣、財神添財富、文昌增智慧、鐘馗除邪業、關公保平安；
            每日可免費供燈上香，表達誠心。搭配獨家祈福力量，另有金香、金果、金牌等強化供品可選，滿足不同祈願需求。
            無論您身在何處，只要一顆虔誠之心，便能與神明心靈相通，獲得無形護佑與祝福。
          </p>
          <div class="service__gods">
            <div
              v-for="(god, key) in godImages"
              :key="key"
              class="service__god"
            >
              <img :src="god.default" :alt="god.label" />
              <div class="service__god-name">{{ god.label }}</div>
            </div>
          </div>
          <div class="service__button-wrap">
            <StartButton
              styleType="yellow"
              label="前往請神供奉"
              @click="goToOffering"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import divinationIntro from '@/assets/image/divinationIntro.png';
import godImages from '@/data/godImages';
import Title from '@/components/common/Title.vue';
import StartButton from '@/components/front/StartButton.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDivination = () => {
  router.push('/divination');
};

const goToOffering = () => {
  router.push('/godOffering');
};
</script>

<style scoped lang="scss">
.service {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    gap: 3rem;
  }

  &__block {
    flex: 0 0 calc(50% - 1.5rem); // 讓兩塊 50% 並排
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    text-align: center;

    @media (max-width: 768px) {
      flex: 0 0 100%;
    }
  }

  &__desc {
    font-size: 15px;
    line-height: 1.8;
    text-align: left;
  }

  &__img-wrap {
    display: flex;
    justify-content: center;
  }

  &__main-img {
    width: 434px;
    height: 204px;
    object-fit: contain;
  }

  &__button-wrap {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 1rem;
  }

  &__gods {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.2rem;
    margin-bottom: 1.5rem;
  }

  &__god {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 88px;
      height: 88px;
      object-fit: contain;
    }

    &-name {
      margin-top: 0.25rem;
      font-size: 13px;
    }
  }
}
</style>
