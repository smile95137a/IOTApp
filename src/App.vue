<template>
  <router-view></router-view>

  <LoadingMask v-if="loadingStore.isLoading" />
  <PaymentMethodDialog v-if="dialogStore.isPaymentMethodDialogOpen" />
  <InfoDialog v-if="dialogStore.isInfoDialogOpen" />
  <ConfirmDialog v-if="dialogStore.isConfirmDialogOpen" />
  <PoeDivinationDialog v-if="dialogStore.isPoeDivinationDialogOpen" />
  <PoeOfferingDialog v-if="dialogStore.isPoeOfferingDialogOpen" />
  <RestPwdDialog v-if="dialogStore.isRestPwdDialogOpen" />
  <StockAdjustDialog v-if="dialogStore.isStockAdjustDialogOpen" />
  <LoadingMask v-if="loadingStore.isLoading" />
</template>

<script setup lang="ts">
import InfoDialog from '@/components/common/InfoDialog.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import PoeDivinationDialog from '@/components/common/PoeDivinationDialog.vue';
import PoeOfferingDialog from '@/components/common/PoeOfferingDialog.vue';
import RestPwdDialog from '@/components/common/RestPwdDialog.vue';
import PaymentMethodDialog from '@/components/common/PaymentMethodDialog.vue';
import StockAdjustDialog from '@/components/admin/StockAdjustDialog.vue';

import LoadingMask from '@/components/common/LoadingMask.vue';
import { useDialogStore } from './stores/dialogStore';
import { useLoadingStore } from './stores/loadingStore';

const loadingStore = useLoadingStore();
const dialogStore = useDialogStore();
</script>

<style scoped>
.layout__body {
  display: flex;
}
.layout__main {
  flex: 1;
}
</style>
