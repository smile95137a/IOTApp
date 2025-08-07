import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useAddBillerCodeIdListDialog() {
  const isAddBillerCodeIdListDialogOpen = ref<boolean>(false);
  const addBillerCodeIdListDialogOptions = ref<DialogOptions | null>(null);
  const addBillerCodeIdListCustomClass = ref<string | undefined>(undefined);
  let resolveAddBillerCodeIdListPromise: (value: boolean) => void;

  const openAddBillerCodeIdListDialog = (): Promise<any> => {
    isAddBillerCodeIdListDialogOpen.value = true;
    return new Promise<any>((resolve) => {
      resolveAddBillerCodeIdListPromise = resolve;
    });
  };

  const closeAddBillerCodeIdListDialog = (result: any) => {
    isAddBillerCodeIdListDialogOpen.value = false;
    if (resolveAddBillerCodeIdListPromise) {
      resolveAddBillerCodeIdListPromise(result);
    }
  };

  return {
    isAddBillerCodeIdListDialogOpen,
    addBillerCodeIdListDialogOptions,
    addBillerCodeIdListCustomClass,
    openAddBillerCodeIdListDialog,
    closeAddBillerCodeIdListDialog,
  };
}
