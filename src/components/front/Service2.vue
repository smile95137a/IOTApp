<template>
  <section class="service">
    <SectionBackground variant="light" />
    <div class="service__container">
      <div class="service__wrapper">
        <div class="service__block">
          <Title text="點燈祈福" color="dark" />
          <p class="service__desc">
            虔誠點燈，傳遞心願祝福。在數位時代，我們為您打造便捷的線上點燈平台，讓您足不出戶即可點亮希望之光。選擇適合的祈福燈種、決定數量（最多10盞），為自己及摯愛親友點亮光明。完成付款後，只需填寫點燈資訊（姓名、生辰、祈福願望），您的心願即化為永恆光芒，在「我的點燈」中閃耀，庇佑平安、招來福氣，讓美好心願得償所願。
          </p>
          <div class="service__img-wrap">
            <div
              v-for="(img, name) in lightImages"
              :key="img.name"
              class="service__light"
            >
              <img
                :src="img.image"
                :alt="img.name"
                class="service__light-image"
              />
            </div>
          </div>
          <div class="service__button-wrap">
            <StartButton
              styleType="red"
              label="前往點燈祈福"
              @click="goToLantern"
            />
          </div>
        </div>

        <div class="service__block">
          <Title text="老師親算" color="dark" />
          <p class="service__desc">
            大師親自為您解惑，以科學視角重新詮釋命理。師融合心理學、管理學與命理學，創立獨樹一幟的科技紫微網。不談宿命論，只談如何掌握命運的方向盤。無論您面臨桃花愛情、婚姻問題、事業發展、流年生涯、學業進修、剖腹擇日、親子家庭困擾，或需命名服務，將以數學邏輯剖析命盤，提供切實可行的解決方案，指引您走向更理想的人生軌跡。
          </p>
          <div class="service__gods">
            <img alt="插圖" :src="teacher1" class="service__main-img" />
          </div>
          <div class="service__button-wrap">
            <StartButton
              styleType="red"
              label="前往老師親算"
              @click="goToMaster"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import teacher1 from '@/assets/image/teacher_1.png';
import lightImages from '@/data/lightImages';
import Title from '@/components/common/Title.vue';
import StartButton from '@/components/front/StartButton.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const goToLantern = () => {
  router.push('/blessing');
};

const goToMaster = () => {
  router.push('/master');
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
    flex-wrap: wrap;
    gap: 8px;
  }

  &__light {
    display: flex;
    flex-direction: column;
    align-items: center;

    &-image {
      width: 56px;
      height: 70px;

      object-fit: contain;
    }
  }

  &__button-wrap {
    display: flex;
    justify-content: flex-end;
    width: 100%;
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
      width: 60px;
      height: auto;
    }

    &-name {
      margin-top: 0.25rem;
      font-size: 13px;
    }
  }
}
</style>
