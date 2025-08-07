import { defineStore } from 'pinia';
import { useConfirmDialog } from '@/hook/confirmDialog';
import { useInfoDialog } from '@/hook/infoDialog';
import { usePoeDivinationDialog } from '@/hook/poeDivinationDialog';
import { usePoeOfferingDialog } from '@/hook/poeOfferingDialog';
import { useRestPwdDialog } from '@/hook/restPwdDialog';
import { usePaymentMethodDialog } from '@/hook/paymentMethodDialog';
import { useStockAdjustDialog } from '@/hook/stockAdjustDialog';

export const useDialogStore = defineStore('dialog', () => {
  const confirmDialog = useConfirmDialog();
  const infoDialog = useInfoDialog();
  const poeDivinationDialog = usePoeDivinationDialog();
  const poeOfferingDialog = usePoeOfferingDialog();
  const restPwdDialog = useRestPwdDialog();
  const paymentMethodDialog = usePaymentMethodDialog();
  const stockAdjustDialog = useStockAdjustDialog();
  return {
    ...confirmDialog,
    ...infoDialog,
    ...poeDivinationDialog,
    ...poeOfferingDialog,
    ...restPwdDialog,
    ...paymentMethodDialog,
    ...stockAdjustDialog,
  };
});
