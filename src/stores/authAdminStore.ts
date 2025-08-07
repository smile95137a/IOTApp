// src/stores/authAdminStore.ts
import { loadState, saveState, removeState } from '@/utils/Localstorage';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthAdminStore = defineStore('authAdmin', () => {
  const user = ref(loadState<any>('admin_user') || null);
  const token = ref<string | null>(loadState<string>('admin_token') || null);

  const isLogin = computed(() => !!token.value);

  const setUser = (userData: any) => {
    user.value = userData;
    saveState('admin_user', userData);
  };

  const setToken = (accessToken: string) => {
    token.value = accessToken;
    saveState('admin_token', accessToken);
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    removeState('admin_user');
    removeState('admin_token');
  };

  return {
    user,
    token,
    isLogin,
    setUser,
    setToken,
    clearAuthData,
  };
});
