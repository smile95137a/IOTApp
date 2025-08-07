<template>
  <div class="noData">
    <div class="noData__img">
      <img :src="p1" alt="noData" />
    </div>
    <p class="noData__text">{{ props.message }}</p>
  </div>
</template>

<script setup lang="ts">
import p1 from '@/assets/image/magic_joe.png';
import { withDefaults, defineProps } from 'vue';

const props = withDefaults(
  defineProps<{
    message?: string;
  }>(),
  {
    message: '查無資料',
  }
);
</script>
