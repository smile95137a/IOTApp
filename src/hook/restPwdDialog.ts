import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
}

export function useRestPwdDialog() {
  const isRestPwdDialogOpen = ref<boolean>(false);
  const customClass = ref<string | undefined>(undefined);
  let resolveRestPwdPromise: (value: boolean) => void;

  const openRestPwdDialog = (options: DialogOptions = {}): Promise<boolean> => {
    isRestPwdDialogOpen.value = true;
    customClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveRestPwdPromise = resolve;
    });
  };

  const closeRestPwdDialog = (result: boolean) => {
    isRestPwdDialogOpen.value = false;
    if (resolveRestPwdPromise) {
      resolveRestPwdPromise(result);
    }
  };

  return {
    isRestPwdDialogOpen,
    customClass,
    openRestPwdDialog,
    closeRestPwdDialog,
  };
}
