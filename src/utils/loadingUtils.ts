import { useLoadingStore } from '@/stores/loadingStore';

export const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
  const loadingStore = useLoadingStore();
  loadingStore.startLoading();
  try {
    return await fn();
  } catch (err) {
    console.error('withLoading error:', err);
    throw err;
  } finally {
    loadingStore.stopLoading();
  }
};
//  const [res1] = await Promise.allSettled([getIpcheckOptions()]);
/**
  const payload = {
    ...form1Data,
    ...form2Data,
  };

  try {
    const { success } = await withLoading(() => save(payload));
    if (success) {
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '資料格式範本設定成功！',
      });
      router.push('/home/b04/b04002/search');
    } else {
      dialogStore.openInfoDialog({
        title: '錯誤',
        message: '儲存失敗，請稍後再試。',
      });
    }
  } catch (error: any) {
    dialogStore.openInfoDialog({
      title: '錯誤',
      message: getErrorMessage(error),
    });
  }
 */
