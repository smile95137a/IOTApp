// stores/masterOrderStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMasterOrderStore = defineStore('masterOrder', () => {
  const step = ref(1);
  const selectedMaster = ref<any>(null);
  const selectedTopic = ref('');
  const name = ref('');
  const phone = ref('');
  const email = ref('');
  const lineId = ref('');
  const productCode = ref('');

  const selectMaster = (master: any) => {
    selectedMaster.value = master;
    selectedTopic.value = master.serviceItem?.[0]?.title || '';
  };

  const nextStep = () => {
    step.value++;
  };

  const resetStep = () => {
    step.value = 1;
    selectedMaster.value = null;
    selectedTopic.value = '';
    name.value = '';
    phone.value = '';
    email.value = '';
    lineId.value = '';
    productCode.value = '';
  };

  return {
    step,
    selectedMaster,
    selectedTopic,
    name,
    phone,
    email,
    lineId,
    productCode,
    selectMaster,
    nextStep,
    resetStep,
  };
});
