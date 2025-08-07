<template>
  <span>{{ formattedNumber }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    number: any;
    locale?: string;
    options?: any;
  }>(),
  {
    locale: 'en-US',
    options: {},
  }
);

const formattedNumber = computed(() => {
  const { number, locale, options } = props;
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    ...options,
  });
  return formatter.format(Number(number));
});
</script>
