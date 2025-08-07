<template>
  <div :class="['section-bg', `section-bg--${variant}`]">
    <template v-if="variant === 'divination'">
      <div class="section-bg__divination">
        <img
          class="section-bg__divination-img section-bg__divination-img--bg"
          :src="bgMain"
          alt="bg"
        />
        <img
          class="section-bg__divination-img section-bg__divination-img--left"
          :src="bgDecoTop"
          alt="left"
        />
        <img
          class="section-bg__divination-img section-bg__divination-img--right"
          :src="bgDecoBot"
          alt="right"
        />
      </div>
    </template>
    <slot />
  </div>
</template>

<script setup lang="ts">
import bgMain from '@/assets/image/bg-main.jpg';
import bgDecoBot from '@/assets/image/bg-deco-bottom.png';
import bgDecoTop from '@/assets/image/bg-deco-top.png';

const props = withDefaults(
  defineProps<{
    variant?: 'red' | 'light' | 'divination';
    code?: string;
    imgLeft?: string;
    imgRight?: string;
    backgroundImage?: string;
  }>(),
  {
    variant: 'red',
    code: '',
    imgLeft: '',
    imgRight: '',
    backgroundImage: '',
  }
);
</script>

<style scoped lang="scss">
.section-bg {
  display: flex;
  flex-direction: column;
  position: absolute;
  inset: 0;
  z-index: -1;

  &--red {
    background: linear-gradient(41.51deg, #e0664d 24.05%, #a53b25 60.53%);
  }

  &--light {
    background: #c2aeaa;
  }

  &__divination {
  }

  &__divination-img {
    position: absolute;
    max-width: 100%;
    height: auto;
    pointer-events: none;
    z-index: 0;

    &--bg {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
    }

    &--left {
      top: 0;
      left: 0;
      width: 280px;
      height: auto;
    }

    &--right {
      bottom: 0;
      right: 0;
      width: 420px;
      height: auto;
    }
  }
}
</style>
