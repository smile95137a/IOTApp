import { ref } from 'vue';

export function usePaymentMethodDialog<T = any>() {
  const isPaymentMethodDialogOpen = ref<boolean>(false);
  const paymentMethodDialogOptions = ref<any | null>(null);
  const paymentMethodDialogCustomClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: T) => void;

  const openPaymentMethodDialog = (options: any = {}): Promise<T> => {
    isPaymentMethodDialogOpen.value = true;
    paymentMethodDialogOptions.value = options;
    paymentMethodDialogCustomClass.value =
      options.paymentMethodDialogCustomClass;
    return new Promise<T>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closePaymentMethodDialog = (result: T) => {
    isPaymentMethodDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isPaymentMethodDialogOpen,
    paymentMethodDialogOptions,
    paymentMethodDialogCustomClass,
    openPaymentMethodDialog,
    closePaymentMethodDialog,
  };
}
