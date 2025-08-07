import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useSearchFnOptionDialog() {
  const isSearchFnOptionDialogOpen = ref<boolean>(false);
  const searchFnOptionDialogOptions = ref<DialogOptions | null>(null);
  const searchFnOptionDialogCustomClass = ref<string | undefined>(undefined);
  let resolveSearchCompanyPromise: (value: boolean) => void;

  const openSearchFnOptionDialog = (
    options: DialogOptions = {}
  ): Promise<boolean> => {
    isSearchFnOptionDialogOpen.value = true;
    searchFnOptionDialogOptions.value = options;
    searchFnOptionDialogCustomClass.value = options.customClass;
    return new Promise<boolean>((resolve) => {
      resolveSearchCompanyPromise = resolve;
    });
  };

  const closeSearchFnOptionDialog = (result: any) => {
    isSearchFnOptionDialogOpen.value = false;
    if (resolveSearchCompanyPromise) {
      resolveSearchCompanyPromise(result);
    }
  };

  return {
    isSearchFnOptionDialogOpen,
    searchFnOptionDialogOptions,
    searchFnOptionDialogCustomClass,
    openSearchFnOptionDialog,
    closeSearchFnOptionDialog,
  };
}
