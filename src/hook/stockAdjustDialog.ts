import { ref } from 'vue';

export function useStockAdjustDialog<T = any>() {
  const isStockAdjustDialogOpen = ref<boolean>(false);
  const stockAdjustDialogProductId = ref<string | null>(null);
  const stockAdjustDialogCustomClass = ref<string | undefined>(undefined);
  let resolveDialogPromise: (value: T) => void;

  const openStockAdjustDialog = (
    productId: string,
    options: { customClass?: string } = {}
  ): Promise<T> => {
    stockAdjustDialogProductId.value = productId;
    stockAdjustDialogCustomClass.value = options.customClass;
    isStockAdjustDialogOpen.value = true;

    return new Promise<T>((resolve) => {
      resolveDialogPromise = resolve;
    });
  };

  const closeStockAdjustDialog = (result: T) => {
    isStockAdjustDialogOpen.value = false;
    if (resolveDialogPromise) {
      resolveDialogPromise(result);
    }
  };

  return {
    isStockAdjustDialogOpen,
    stockAdjustDialogProductId,
    stockAdjustDialogCustomClass,
    openStockAdjustDialog,
    closeStockAdjustDialog,
  };
}
