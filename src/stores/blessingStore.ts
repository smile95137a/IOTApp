import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface BlessingContact {
  name: string;
  birthday: string;
  message: string;
}

export const useBlessingStore = defineStore('blessing', () => {
  const step = ref(1);
  const selectedLamp = ref<any | null>(null);
  const quantity = ref(1);
  const contactInfos = ref<BlessingContact[]>([]);

  const nextStep = () => {
    if (step.value < 2) step.value++;
  };
  const prevStep = () => {
    if (step.value > 1) step.value--;
  };
  const resetStep = () => {
    step.value = 1;
  };

  const setSelectedLamp = (lamp: any) => {
    selectedLamp.value = lamp;
  };

  const setQuantity = (val: number) => {
    quantity.value = val;
    contactInfos.value = Array.from({ length: val }, () => ({
      name: '',
      birthday: '',
      message: '',
    }));
  };

  const updateContact = (
    index: number,
    field: keyof BlessingContact,
    value: string
  ) => {
    if (contactInfos.value[index]) {
      contactInfos.value[index][field] = value;
    }
  };

  const resetBlessing = () => {
    selectedLamp.value = null;
    quantity.value = 1;
    contactInfos.value = [];
    resetStep();
  };

  const selectedPrice = ref<{ month: number; price: number } | null>(null);

  const setSelectedPrice = (price: { month: number; price: number }) => {
    selectedPrice.value = price;
  };

  return {
    step,
    nextStep,
    prevStep,
    resetStep,
    selectedLamp,
    quantity,
    contactInfos,
    setSelectedLamp,
    setQuantity,
    updateContact,
    resetBlessing,
    selectedPrice,
    setSelectedPrice,
  };
});
