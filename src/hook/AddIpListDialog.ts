import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useAddIpListDialog() {
  const isAddIpListDialogOpen = ref<boolean>(false);
  const addIpListDialogOptions = ref<DialogOptions | null>(null);
  const addIpListCustomClass = ref<string | undefined>(undefined);
  let resolveAddIpListPromise: (value: boolean) => void;

  const openAddIpListDialog = (): Promise<any> => {
    isAddIpListDialogOpen.value = true;
    return new Promise<any>((resolve) => {
      resolveAddIpListPromise = resolve;
    });
  };

  const closeAddIpListDialog = (result: any) => {
    isAddIpListDialogOpen.value = false;
    if (resolveAddIpListPromise) {
      resolveAddIpListPromise(result);
    }
  };

  return {
    isAddIpListDialogOpen,
    addIpListDialogOptions,
    addIpListCustomClass,
    openAddIpListDialog,
    closeAddIpListDialog,
  };
}
