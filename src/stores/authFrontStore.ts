// src/stores/authFrontStore.ts
import { loadState, saveState, removeState } from '@/utils/Localstorage';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthFrontStore = defineStore('authFront', () => {
  const user = ref(loadState<any>('front_user') || null);
  const token = ref<string | null>(loadState<string>('front_token') || null);

  const isLogin = computed(() => !!token.value);

  const setUser = (userData: any) => {
    user.value = userData;
    saveState('front_user', userData);
  };

  const setToken = (accessToken: string) => {
    token.value = accessToken;
    saveState('front_token', accessToken);
  };

  const clearAuthData = () => {
    user.value = null;
    token.value = null;
    removeState('front_user');
    removeState('front_token');
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
