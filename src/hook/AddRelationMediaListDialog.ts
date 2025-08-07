import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useAddRelationMediaListDialog() {
  const isAddRelationMediaListDialogOpen = ref<boolean>(false);
  const addRelationMediaListDialogOptions = ref<DialogOptions | null>(null);
  const addRelationMediaListCustomClass = ref<string | undefined>(undefined);
  let resolveAddRelationMediaListPromise: (value: boolean) => void;

  const openAddRelationMediaListDialog = (): Promise<any> => {
    isAddRelationMediaListDialogOpen.value = true;
    return new Promise<any>((resolve) => {
      resolveAddRelationMediaListPromise = resolve;
    });
  };

  const closeAddRelationMediaListDialog = (result: any) => {
    isAddRelationMediaListDialogOpen.value = false;
    if (resolveAddRelationMediaListPromise) {
      resolveAddRelationMediaListPromise(result);
    }
  };

  return {
    isAddRelationMediaListDialogOpen,
    addRelationMediaListDialogOptions,
    addRelationMediaListCustomClass,
    openAddRelationMediaListDialog,
    closeAddRelationMediaListDialog,
  };
}
