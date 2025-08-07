<template>
  <DivinationInfo v-if="stepIndex === 1" />
  <DivinationConfirm v-if="stepIndex === 2" />
  <DivinationResult v-if="stepIndex === 3" />
</template>

<script setup lang="ts">
import DivinationInfo from '@/components/front/DivinationInfo.vue';
import DivinationConfirm from '@/components/front/DivinationConfirm.vue';
import DivinationResult from '@/components/front/DivinationResult.vue';
import { storeToRefs } from 'pinia';
import { useDivinationStepStore } from '@/stores/divinationStepStore';

const stepStore = useDivinationStepStore();
const { stepIndex } = storeToRefs(stepStore);
const { resetStep } = stepStore;
import { onMounted } from 'vue';

onMounted(() => {
  resetStep();
});
</script>
