<template>
  <span>{{ formattedDate }}</span>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    date: string;
    format?: string;
  }>(),
  {
    format: 'YYYY-MM-DD',
  }
);

const formattedDate = computed(() => {
  const { date, format } = props;
  const parsedDate = moment(date);
  return parsedDate.format(format);
});
</script>
