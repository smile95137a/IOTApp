<template>
  <div
    class="start-button"
    :class="[
      `start-button--${styleType}`,
      { 'start-button--disabled': disabled },
    ]"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <div
      class="start-button__text"
      :class="[`start-button__text--${styleType}`]"
    >
      {{ label }}
    </div>
    <div class="start-button__cloud">
      <img :src="resolvedCloudIcon" alt="cloud" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import cloudR from '@/assets/image/c-r.png';
import cloudY from '@/assets/image/c-y.png';
import cloudDivination from '@/assets/image/bwa-sheng.png';
import bwaSheng from '@/assets/image/bwa-sheng.png';
const props = defineProps<{
  label?: string;
  styleType?: 'red' | 'yellow';
  disabled?: boolean;
  isDivination?: boolean;
  useBwaSheng?: boolean; // ✅ 新增
}>();

const emit = defineEmits(['click']);

const handleClick = () => {
  if (props.disabled) return;
  emit('click');
};

const resolvedCloudIcon = computed(() => {
  if (props.useBwaSheng) return bwaSheng;
  if (props.isDivination) return cloudDivination;
  return props.styleType === 'red' ? cloudR : cloudY;
});
</script>

<style lang="scss" scoped>
.start-button {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  font-family: 'Noto Sans TC', sans-serif;

  &__text {
    padding: 0 0.5rem;
    white-space: nowrap;
    padding: 0.5rem 1rem;

    &--red {
      border-top: 1px solid #a53b25;
      border-bottom: 1px solid #a53b25;
    }

    &--yellow {
      border-top: 1px solid #f7c56b;
      border-bottom: 1px solid #f7c56b;
    }
  }

  &__cloud {
    margin-left: 0.5rem;

    img {
      width: 77px;
      height: 61px;
      object-fit: contain;
    }
  }

  &--red {
    color: #a2352c;
  }

  &--yellow {
    color: #f7c56b;
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;

    .start-button__text {
      text-decoration: line-through;
    }
  }
}
</style>
