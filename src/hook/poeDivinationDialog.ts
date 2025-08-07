import { ref } from 'vue';

interface DialogOptions {
  poeDivinationDialogCustomClass?: string;
  title?: string;
  message?: string;
}

export function usePoeDivinationDialog() {
  const isPoeDivinationDialogOpen = ref<boolean>(false);
  const poeDivinationDialogOptions = ref<DialogOptions | null>(null);
  const poeDivinationDialogCustomClass = ref<string | undefined>(undefined);
  let resolveConfirmPromise: (value: boolean) => void;

  const openPoeDivinationDialog = (
    options: DialogOptions = {}
  ): Promise<boolean> => {
    isPoeDivinationDialogOpen.value = true;
    poeDivinationDialogOptions.value = options;
    poeDivinationDialogCustomClass.value =
      options.poeDivinationDialogCustomClass;
    return new Promise<boolean>((resolve) => {
      resolveConfirmPromise = resolve;
    });
  };

  const closePoeDivinationDialog = (result: boolean) => {
    isPoeDivinationDialogOpen.value = false;
    if (resolveConfirmPromise) {
      resolveConfirmPromise(result);
    }
  };

  return {
    isPoeDivinationDialogOpen,
    poeDivinationDialogOptions,
    poeDivinationDialogCustomClass,
    openPoeDivinationDialog,
    closePoeDivinationDialog,
  };
}
