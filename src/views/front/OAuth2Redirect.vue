<template>
  <div>
    <div v-if="redirectTo">
      <p>Redirecting to the specified route...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { useDialogStore } from '@/stores/dialogStore';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const authStore = useAuthFrontStore();
const dialogStore = useDialogStore();

const redirectTo = ref<string | null>(null);

onMounted(async () => {
  const accessToken = extractUrlParameter('token');
  if (accessToken) {
    authStore.setToken(accessToken);
    redirectTo.value = '/home';
    router.push(redirectTo.value);
  } else {
    const errorMsg = extractUrlParameter('errorMsg');
    await dialogStore.openInfoDialog({
      title: '系統消息',
      message: errorMsg?.toString(),
    });
    redirectTo.value = '/login';
    router.push(redirectTo.value);
  }
});

const extractUrlParameter = (key: string): string | null => {
  return (route.query[key] as string) || null;
};
</script>
