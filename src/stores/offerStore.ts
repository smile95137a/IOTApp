// src/stores/offerStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useOfferStore = defineStore('offerStore', () => {
  const step = ref(1);

  const selectedGod = ref<any | null>(null);
  const selectedOfferings = ref<string[]>([]);
  const isGodInvoked = ref(false);

  const isGodSelected = computed(() => selectedGod.value !== null);
  const isFinalStep = computed(() => step.value === 3);

  const setSelectedGod = (god: any) => {
    selectedGod.value = god;
  };

  const toggleOffering = (offering: string) => {
    const index = selectedOfferings.value.indexOf(offering);
    if (index >= 0) {
      selectedOfferings.value.splice(index, 1);
    } else {
      selectedOfferings.value.push(offering);
    }
  };

  const nextStep = () => {
    if (step.value < 5) step.value += 1;
  };

  const prevStep = () => {
    if (step.value > 1) step.value -= 1;
  };

  const goToStep = (targetStep: number) => {
    if (targetStep >= 1 && targetStep <= 5) {
      step.value = targetStep;
    }
  };

  const setGodInvoked = (status: boolean) => {
    isGodInvoked.value = status;
  };

  const resetOfferProcess = () => {
    step.value = 1;
    selectedGod.value = null;
    selectedOfferings.value = [];
    isGodInvoked.value = false;
  };

  return {
    step,
    selectedGod,
    selectedOfferings,
    isGodSelected,
    isFinalStep,
    isGodInvoked,
    setGodInvoked,
    setSelectedGod,
    toggleOffering,
    nextStep,
    prevStep,
    goToStep,
    resetOfferProcess,
  };
});
