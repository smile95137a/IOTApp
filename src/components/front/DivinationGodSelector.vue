<template>
  <div class="god-selector">
    <SectionBackground variant="divination" />
    <div class="god-selector__container">
      <header class="god-selector__header">
        <Title :text="`擲杯請神`" color="white" />
      </header>

      <div class="god-selector__main">
        <div class="god-selector__circle">
          <img
            :src="selectedGod.highlighted"
            alt="主神"
            class="god-selector__main-god"
          />
        </div>
        <div class="god-selector__subtitle">擲筊請神</div>
      </div>

      <div class="god-selector__list">
        <button
          v-for="(god, key) in godList"
          :key="key"
          class="god-selector__item"
          :class="{ 'god-selector__item--active': selectedKey === key }"
          @click="selectGod(key)"
        >
          <img
            :src="god.default"
            class="god-selector__item-image"
            :alt="god.label"
          />
          <div class="god-selector__item-name">{{ god.label }}</div>
        </button>
      </div>

      <div
        v-if="selectedGod"
        class="god-selector__description"
        v-html="selectedGod.description"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import godImages from '@/data/godImages';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import { ref, computed } from 'vue';

type GodKey = keyof typeof godImages;

const godList = godImages;
const selectedKey = ref<GodKey | null>(null);

const selectGod = (key: GodKey) => {
  selectedKey.value = key;
};

const selectedGod = computed(() =>
  selectedKey.value ? godList[selectedKey.value] : null
);
</script>

<style lang="scss" scoped>
.god-selector {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  &__logo {
    width: 40px;
    height: auto;
  }

  &__title {
    font-size: 1.5rem;
    color: white;
    font-weight: bold;
  }

  &__main {
    position: relative;
    text-align: center;
    margin-bottom: 2rem;
  }

  &__circle {
    background: #d94d3b;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  &__main-god {
    width: 120px;
    height: auto;
  }

  &__subtitle {
    color: #792c24;
    margin-top: 1rem;
    font-size: 1.1rem;
    font-weight: bold;
  }

  &__list {
    display: flex;
    justify-content: center;
    align-items: stretch;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: nowrap;

    .god-selector__item {
      background-color: #fff;
      border-radius: 1.5rem;
      border: 2px solid transparent;
      width: 180px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 1rem;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      transition: all 0.2s ease;

      // 背景條紋
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          transparent 0%,
          #eeafa24d 50%,
          transparent 100%
        );
        z-index: 0;
      }

      &:hover {
        transform: translateY(-3px);
      }

      &--active {
        border-color: #d94d3b;
        background-color: #fff6f5;
      }

      .god-selector__item-image {
        width: 48px;
        height: auto;
        margin-right: 0.75rem;
        z-index: 1;
      }

      .god-selector__item-name {
        font-size: 1.1rem;
        font-weight: bold;
        color: #42210b;
        z-index: 1;
      }
    }
  }

  &__description {
    max-width: 720px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #4a3a2a;
    background: #fdf6f0;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e0c4b4;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    &__list {
      flex-wrap: wrap;
      justify-content: center;

      .god-selector__item {
        width: 160px;
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
