<template>
  <div class="mall-card" @click="goToDetail">
    <div class="mall-card__image">
      <img :src="getImageUrl(product.image)" :alt="product.name" />
    </div>
    <div class="mall-card__info">
      <p class="mall-card__name">{{ product.name }}</p>
      <div class="mall-card__price">
        <span class="mall-card__price--current"
          >NT${{ formatPrice(product.price) }}</span
        >
        <span class="mall-card__price--original"
          >NT${{ formatPrice(product.originalPrice) }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/ImageUtils';
const router = useRouter();
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const formatPrice = (value) => {
  return value?.toLocaleString?.() ?? '';
};
const goToDetail = () => {
  router.push(`/store/${props.product.id}`);
};
</script>

<style scoped lang="scss">
.mall-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  &__image {
    position: relative;
    width: 100%;
    padding-top: 100%; // 1:1 比例
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      object-fit: contain;
      width: 100%;
      height: 100%;
    }
  }

  &__info {
    padding: 12px;
  }

  &__name {
    font-size: 14px;
    font-weight: 500;
    color: #222;
    min-height: 40px;
    margin-bottom: 6px;
    line-height: 1.4;
  }

  &__price {
    display: flex;
    gap: 10px;
    align-items: baseline;

    &--current {
      font-size: 16px;
      color: #d1005d;
      font-weight: bold;
    }

    &--original {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }
  }
}
</style>
