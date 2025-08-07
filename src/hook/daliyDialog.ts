import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
}

export function useDaliyDialog() {
  const isDaliyDialogOpen = ref<boolean>(false);
  const customClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openDaliyDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isDaliyDialogOpen.value = true;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closeDaliyDialog = (result: boolean) => {
    isDaliyDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isDaliyDialogOpen,
    customClass,
    openDaliyDialog,
    closeDaliyDialog,
  };
}
