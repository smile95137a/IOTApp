<template>
  <div class="title">
    <img :src="iconSrc" alt="icon" class="title__icon" />
    <span :class="['title__text', `title__text--${color}`]">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import redIcon from '@/assets/image/title-head-red.png';
import whiteIcon from '@/assets/image/title-head-white.png';
import darkIcon from '@/assets/image/title-head-dark.png';
import lightIcon from '@/assets/image/title-head-light.png';

type ColorType = 'red' | 'white' | 'dark' | 'light';

const props = withDefaults(
  defineProps<{
    text?: string;
    color?: ColorType;
  }>(),
  {
    text: '最新燈場',
    color: 'red',
  }
);

// 背景色
const backgroundColor = computed(() => {
  switch (props.color) {
    case 'white':
      return '#ffffff';
    case 'dark':
      return '#333333';
    case 'light':
      return '#eeeeee';
    case 'red':
    default:
      return 'linear-gradient(90deg, #a23d27, #b7492e)';
  }
});

// 圖片對應
const iconMap: Record<ColorType, string> = {
  red: redIcon,
  white: whiteIcon,
  dark: darkIcon,
  light: lightIcon,
};

const iconSrc = computed(() => iconMap[props.color]);
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;

  &__icon {
    height: 32px;
    margin-right: 12px;
  }

  &__text {
    font-size: 20px;
    font-weight: bold;
    transition: color 0.2s ease;

    &--red {
      color: #a53b25;
    }
    &--dark {
      color: #3c2313;
    }
    &--white {
      color: #ffffff;
    }
    &--light {
      color: #eeafa2;
    }
  }
}
</style>
