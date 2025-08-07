<template>
  <section class="light-blessing">
    <SectionBackground variant="divination" />
    <div class="light-blessing__container">
      <Title :text="`點燈祈福`" color="white" />
      <div class="light-blessing__content">
        <div class="light-blessing__text">
          <p class="light-blessing__description">
            虔誠點燈，傳遞心願祝福。在數位時代，我們為您打造便捷的線上點燈平台，讓您足不出戶即可點亮希望之光。選擇適合的祈福燈種、決定數量（最多10盞），為自己及摯愛親友點亮光明。完成付款後，只需填寫點燈資訊（姓名、生辰、祈福願望），您的心願即化為永恆光芒，在「我的點燈」中閃耀，庇佑平安、招來福氣，讓美好心願得償所願。
          </p>
          <p class="light-blessing__note">
            無論您身在何處，只要一顆虔誠之心，便能與神明心靈相通，獲得無形護持與祝福。
          </p>
        </div>

        <div class="light-blessing__lamp-list">
          <div
            v-for="(img, name) in lightImages"
            :key="img.name"
            class="light-blessing__lamp"
          >
            <img :src="img.image" class="light-blessing__lamp-img" />
            <p class="light-blessing__lamp-name">{{ img.name }}</p>
          </div>
        </div>
      </div>
      <LightBlessingTabs />
    </div>
  </section>

  <LatestLightScene />
  <LightBlessingScene />
  <TopLightBlessingScene />
</template>

<script setup lang="ts">
import Header from '@/components/front/Header.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import LightBlessingTabs from '@/components/front/LightBlessingTabs.vue';
import LatestLightScene from '@/components/front/LatestLightScene.vue';
import LightBlessingScene from '@/components/front/LightBlessingScene.vue';
import TopLightBlessingScene from '@/components/front/TopLightBlessingScene.vue';
import Footer from '@/components/front/Footer.vue';
import Title from '@/components/common/Title.vue';
import lightImages from '@/data/lightImages';
</script>
<style scoped lang="scss">
.light-blessing {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__content {
    display: flex;
    flex-direction: row;
    gap: 3rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__text {
    flex: 1;
    max-width: 50%;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  &__description {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1rem;
    text-align: left;
  }

  &__note {
    font-size: 0.95rem;
    opacity: 0.9;
  }

  &__lamp-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 6px;
    flex: 1;
    max-width: 50%;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  &__lamp {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__lamp-img {
    width: 90px;
    height: 90px;
    object-fit: contain;

    @media (max-width: 768px) {
      width: 64px;
    }
  }

  &__lamp-name {
    margin-top: 0.5rem;
    font-size: 1rem;
    color: #fff;
  }
}
</style>
