<template>
  <div class="mall-list">
    <div class="mall-list__title">
      <div class="mall-list__title-text">
        {{ title }}
      </div>
    </div>
    <p class="mall-list__desc" v-if="description">{{ description }}</p>

    <div class="mall-list__grid">
      <MallProductCard
        v-for="item in displayedProducts"
        :key="item.id"
        :product="item"
      />
    </div>

    <div
      class="mall-list__load-more"
      v-if="displayedProducts.length < products.length"
    >
      <button class="mall-list__btn" @click="loadMore">
        <span class="mall-list__btn-text">更多</span>
        <i class="fas fa-angle-right mall-list__arrow"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MallProductCard from './MallProductCard.vue';

const props = withDefaults(
  defineProps<{
    title: string;
    description?: string;
    products: any[];
    initialCount?: number;
    step?: number;
  }>(),
  {
    description: '',
    initialCount: 8,
    step: 8,
  }
);
const displayCount = ref(props.initialCount);
const displayedProducts = computed(() =>
  props.products.slice(0, displayCount.value)
);

const loadMore = () => {
  displayCount.value += props.step;
};
</script>

<style lang="scss" scoped>
.mall-list {
  &__title {
    border-bottom: 2px solid #a53b25;
    margin: 32px 0;

    &-text {
      width: 100%;
      max-width: 392px;
      background: #a53b25;
      color: #fff;
      padding: 12px;
      font-size: 20px;
      font-weight: bold;
    }
  }

  &__desc {
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
  }

  &__load-more {
    margin-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__btn {
    background-color: #3c2313;
    color: #ffbf45;
    border: none;
    padding: 10px 24px;
    font-size: 14px;
    font-weight: bold;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s;
    width: 100%;
    max-width: 180px;

    &:hover {
      background-color: #5a2a0c;
    }
  }

  &__btn-text {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  &__arrow {
    font-size: 12px;
  }
}
</style>
