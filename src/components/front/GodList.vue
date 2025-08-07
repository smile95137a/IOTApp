<template>
  <div class="god">
    <SectionBackground variant="light" />
    <div class="god__container">
      <div class="god__list">
        <div v-for="(god, key) in godImages" :key="key" class="god__card">
          <div class="god__content">
            <img :src="god.default" :alt="god.label" class="god__image" />
            <Title :text="god.label" color="dark" />
            <p class="god__description" v-html="god.description"></p>
          </div>
          <div class="god__action">
            <StartButton
              styleType="red"
              label="請神保庇"
              @click="goToDivinationGod(key)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import godImages from '@/data/godImages';
import Title from '@/components/common/Title.vue';
import StartButton from '@/components/front/StartButton.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';

const router = useRouter();

const goToDivinationGod = (key) => {
  router.push({ path: '/offeringHall', query: { god: key } });
};
</script>

<style lang="scss" scoped>
.god {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;

    @media (max-width: 768px) {
      align-items: center;
      text-align: center;
    }
  }

  &__content {
    position: relative;

    .god__image {
      float: right;
      width: 204px;
      height: 204px;
      object-fit: contain;
      margin-left: 1rem;
      margin-bottom: 0.5rem;

      @media (max-width: 768px) {
        float: none;
        display: block;
        margin: 0 auto 1rem;
      }
    }

    .god__description {
      position: relative;
      margin-top: 24px;
      font-size: 14px;
      line-height: 1.6;
      color: #222;
      text-align: justify;
    }
  }

  &__action {
    display: flex;
    justify-content: flex-end;
    width: 100%;

    @media (max-width: 768px) {
      justify-content: center;
    }
  }

  &__action-btn {
    display: flex;
    align-items: center;
    border: none;
    background-color: transparent;
    padding: 0.5rem 1rem;
    position: relative;
    cursor: pointer;
    appearance: none;
    flex-direction: column;

    &::before,
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background-color: #a22d18;
    }

    &::before {
      margin-bottom: 0.3rem;
    }

    &::after {
      margin-top: 0.3rem;
    }

    &-text {
      color: #a22d18;
      font-size: 16px;
      font-weight: bold;
      white-space: nowrap;
    }

    &-icon {
      width: 36px;
      height: auto;
      margin-left: 0.5rem;

      @media (max-width: 768px) {
        width: 30px;
      }
    }
  }
}
</style>
