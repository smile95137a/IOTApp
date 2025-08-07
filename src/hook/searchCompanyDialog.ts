import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useSearchCompanyDialog() {
  const isSearchCompanyDialogOpen = ref<boolean>(false);
  const searchCompanyDialogOptions = ref<DialogOptions | null>(null);
  const searchCompanyCustomClass = ref<string | undefined>(undefined);
  let resolveSearchCompanyPromise: (value: boolean) => void;

  const openSearchCompanyDialog = (
    options: DialogOptions = {}
  ): Promise<any> => {
    isSearchCompanyDialogOpen.value = true;
    searchCompanyDialogOptions.value = options;
    searchCompanyCustomClass.value = options.customClass;
    return new Promise<any>((resolve) => {
      resolveSearchCompanyPromise = resolve;
    });
  };

  const closeSearchCompanyDialog = (result: any) => {
    isSearchCompanyDialogOpen.value = false;
    if (resolveSearchCompanyPromise) {
      resolveSearchCompanyPromise(result);
    }
  };

  return {
    isSearchCompanyDialogOpen,
    searchCompanyDialogOptions,
    searchCompanyCustomClass,
    openSearchCompanyDialog,
    closeSearchCompanyDialog,
  };
}
