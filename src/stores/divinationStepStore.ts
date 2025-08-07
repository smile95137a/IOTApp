import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDivinationStepStore = defineStore('divinationStep', () => {
  const stepIndex = ref(1);

  const nextStep = () => {
    if (stepIndex.value < 3) stepIndex.value++;
  };

  const prevStep = () => {
    if (stepIndex.value > 1) stepIndex.value--;
  };

  const resetStep = () => {
    stepIndex.value = 1;
  };

  return {
    stepIndex,
    nextStep,
    prevStep,
    resetStep,
  };
});
