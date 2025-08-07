<template>
  <button
    :class="[
      'mbtn',
      typeClass,
      { 'mbtn--disabled': disabled },
      ...normalizeClass(customClass),
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from 'vue';

// 使用 withDefaults 設定默認值
const props = withDefaults(
  defineProps<{
    customClass?: string | string[]; // 支持字符串或數組形式的類名
    type?: string; // 預定義按鈕類型
    disabled?: boolean;
  }>(),
  {
    customClass: '',
    type: '', // 默認為 primary 類型
    disabled: false,
  }
);

const emit = defineEmits(['click']);

// 處理類名：確保類名可以是字符串或數組
const normalizeClass = (
  classValue: string | string[] | undefined
): string[] => {
  if (!classValue) return [];
  return Array.isArray(classValue) ? classValue : classValue.split(' ');
};

// 動態類型類名
const typeClass = `mbtn--${props.type}`;

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
