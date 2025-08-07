import { useDialogStore } from '@/stores/dialogStore';
import { getErrorMessage } from './ErrorUtils';
import { withLoading } from './loadingUtils';

interface ExecuteApiOptions<T> {
  fn: () => Promise<{ success: boolean; message?: string; data?: T }>;
  successTitle?: string;
  successMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  onSuccess?: (res: T) => void | Promise<void>;
  onFail?: (res: T) => void | Promise<void>;
  showCatchDialog?: boolean;
  showFailDialog?: boolean;
}

export async function executeApi<T = any>({
  fn,
  successTitle = '成功',
  successMessage = '操作成功',
  errorTitle = '錯誤',
  errorMessage = '操作失敗，請稍後再試。',
  onSuccess,
  onFail,
  showCatchDialog = false,
  showFailDialog = false,
}: ExecuteApiOptions<T>): Promise<T | null> {
  const dialogStore = useDialogStore();

  try {
    const { success, data, message } = await withLoading(() => fn());

    if (success) {
      if (onSuccess) await onSuccess(data!);
      return data ?? null;
    } else {
      if (showFailDialog) {
        await dialogStore.openInfoDialog({
          title: errorTitle,
          message: message || errorMessage,
        });
      }
      console.log(message || errorMessage);
      if (onFail) await onFail(data);
      return null;
    }
  } catch (error) {
    if (showCatchDialog) {
      await dialogStore.openInfoDialog({
        title: errorTitle,
        message: getErrorMessage(error),
      });
    }

    return null;
  }
}
