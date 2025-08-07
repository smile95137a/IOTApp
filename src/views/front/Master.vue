<template>
  <MasterIntro v-if="step === 1" />
  <MasterForm v-if="step === 2" />
  <OrderSuccess v-if="step === 3" />
</template>

<script setup lang="ts">
import MasterIntro from './MasterIntro.vue';
import MasterForm from './MasterForm.vue';
import OrderSuccess from './OrderSuccess.vue';
import { useMasterOrderStore } from '@/stores/masterOrderStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const store = useMasterOrderStore();
const { step } = storeToRefs(store);
onMounted(() => {
  store.resetStep();
});
</script>
