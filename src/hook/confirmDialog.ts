import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog() {
  const isConfirmDialogOpen = ref<boolean>(false);
  const confirmDialogOptions = ref<DialogOptions | null>(null);
  const customClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openConfirmDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isConfirmDialogOpen.value = true;
    confirmDialogOptions.value = options;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closeConfirmDialog = (result: boolean) => {
    isConfirmDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isConfirmDialogOpen,
    confirmDialogOptions,
    customClass,
    openConfirmDialog,
    closeConfirmDialog,
  };
}
