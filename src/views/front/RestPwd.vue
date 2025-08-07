<template>
  <RestPwdForm v-if="isActiveUrl" />
</template>

<script lang="ts" setup>
import { verifyResetToken } from '@/services/UserService';
import { useDialogStore } from '@/stores/dialogStore';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RestPwdForm from '@/components/front/RestPwdForm.vue';

interface ErrMsg {
  title: string;
  message: string;
}

const errCodeMap: Record<string, ErrMsg> = {
  9001: {
    title: '失效的連結',
    message: '連結已被使用，請您再確認。',
  },
  9002: {
    title: '失效的連結',
    message: '連結已過期，請您再確認。',
  },
  9003: {
    title: '無效的連結',
    message: '無效的連結，請您再確認。',
  },
  9004: {
    title: '無效的連結',
    message: '不存在此連結，請您再確認。',
  },
};

const route = useRoute();
const token = route.params.token as string;

const dialogStore = useDialogStore();

const isActiveUrl = ref(false);
const errMsgObj = ref<ErrMsg>({ title: '', message: '' });

const verifyToken = async () => {
  try {
    const { success, data } = await verifyResetToken(token);
    if (success) {
      isActiveUrl.value = true;
    } else {
      isActiveUrl.value = false;
      await dialogStore.openInfoDialog({
        title: '系統通知',
        message: '未知的錯誤，請稍後再試。',
      });
    }
  } catch (error: any) {
    console.error('Error during token verification:', error);
    const code = (error.data?.code as keyof typeof errCodeMap) || '9004';
    isActiveUrl.value = false;
    errMsgObj.value = errCodeMap[code];
    console.log('Error message set to:', errMsgObj.value);
    await dialogStore.openInfoDialog({
      title: '系統通知',
      message: errMsgObj.value.message,
    });
  }
};

onMounted(() => {
  console.log('Component mounted, starting token verification...');
  verifyToken();
});
</script>
