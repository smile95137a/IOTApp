<template>
  <div
    v-if="isOpen"
    :class="['dialog', ...normalizeClass(customClass), sizeClass]"
  >
    <div class="dialog__overlay" @click="handleClose(false)"></div>
    <div class="dialog__main">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    customClass?: string | string[]; // 支持字符串或字符串数组
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    customClass: '',
    size: 'md',
  }
);

const emit = defineEmits<{
  (e: 'close', result: boolean): void;
}>();

// Normalize class to ensure it's always an array
const normalizeClass = (cls: string | string[] | undefined) => {
  if (!cls) return [];
  return Array.isArray(cls) ? cls : [cls];
};

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'dialog--sm';
    case 'lg':
      return 'dialog--lg';
    default:
      return 'dialog--md';
  }
});

const handleClose = (result: boolean) => {
  emit('close', result);
};
</script>
