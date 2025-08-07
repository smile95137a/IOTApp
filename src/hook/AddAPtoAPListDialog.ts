import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useAddAPtoAPListDialog() {
  const isAddAPtoAPListDialogOpen = ref<boolean>(false);
  const addAPtoAPListDialogOptions = ref<DialogOptions | null>(null);
  const addAPtoAPListDialogCustomClass = ref<string | undefined>(undefined);
  let resolveAddIpListPromise: (value: boolean) => void;

  const openAddAPtoAPListDialog = (): Promise<any> => {
    isAddAPtoAPListDialogOpen.value = true;
    return new Promise<any>((resolve) => {
      resolveAddIpListPromise = resolve;
    });
  };

  const closeAddAPtoAPListDialog = (result: any) => {
    isAddAPtoAPListDialogOpen.value = false;
    if (resolveAddIpListPromise) {
      resolveAddIpListPromise(result);
    }
  };

  return {
    isAddAPtoAPListDialogOpen,
    addAPtoAPListDialogOptions,
    addAPtoAPListDialogCustomClass,
    openAddAPtoAPListDialog,
    closeAddAPtoAPListDialog,
  };
}
