import { ref } from 'vue';

interface DialogOptions {
  customClass?: string;
  title?: string;
  message?: string;
  queryFn?: (data?: any) => any;
}

export function useSearchFileTypeDialog() {
  const isSearchFileTypeDialogOpen = ref<boolean>(false);
  const searchFileTypeDialogOptions = ref<DialogOptions | null>(null);
  const searchFileTypeCustomClass = ref<string | undefined>(undefined);
  let resolveSearchFileTypePromise: (value: boolean) => void;

  const openSearchFileTypeDialog = (
    options: DialogOptions = {}
  ): Promise<any> => {
    isSearchFileTypeDialogOpen.value = true;
    searchFileTypeDialogOptions.value = options;
    searchFileTypeCustomClass.value = options.customClass;
    return new Promise<any>((resolve) => {
      resolveSearchFileTypePromise = resolve;
    });
  };

  const closeSearchFileTypeDialog = (result: any) => {
    isSearchFileTypeDialogOpen.value = false;
    if (resolveSearchFileTypePromise) {
      resolveSearchFileTypePromise(result);
    }
  };

  return {
    isSearchFileTypeDialogOpen,
    searchFileTypeDialogOptions,
    searchFileTypeCustomClass,
    openSearchFileTypeDialog,
    closeSearchFileTypeDialog,
  };
}
