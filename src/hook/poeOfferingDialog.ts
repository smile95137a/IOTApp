import { ref } from 'vue';

interface DialogOptions {
  poeOfferingDialogCustomClass?: string;
  title?: string;
  message?: string;
}

export function usePoeOfferingDialog<T = any>() {
  const isPoeOfferingDialogOpen = ref<boolean>(false);
  const poeOfferingDialogOptions = ref<DialogOptions | null>(null);
  const poeOfferingDialogCustomClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: T) => void;

  const openPoeOfferingDialog = (options: DialogOptions = {}): Promise<T> => {
    isPoeOfferingDialogOpen.value = true;
    poeOfferingDialogOptions.value = options;
    poeOfferingDialogCustomClass.value = options.poeOfferingDialogCustomClass;
    return new Promise<T>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closePoeOfferingDialog = (result: T) => {
    isPoeOfferingDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isPoeOfferingDialogOpen,
    poeOfferingDialogOptions,
    poeOfferingDialogCustomClass,
    openPoeOfferingDialog,
    closePoeOfferingDialog,
  };
}
