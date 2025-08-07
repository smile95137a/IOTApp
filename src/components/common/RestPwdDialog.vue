<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--restPwdDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <form class="restPwdDialog__form" @submit.prevent="onSubmit">
      <div class="restPwdDialog">
        <div class="restPwdDialog__header">
          <div class="restPwdDialog__close" @click="handleClose(false)">
            <i class="fa-solid fa-xmark"></i>
          </div>
        </div>

        <div class="restPwdDialog__main">
          <div class="restPwdDialog__main-content">
            <div class="restPwdDialog__form-inputs">
              <p class="restPwdDialog__text">電子信箱</p>
              <input
                class="restPwdDialog__form-input"
                v-model="email"
                v-bind="emailProps"
                :class="{ 'restPwdDialog__form-input--error': errors.email }"
              />
              <p class="restPwdDialog__text restPwdDialog__text--error">
                {{ errors.email }}
              </p>
            </div>
          </div>
          <div class="restPwdDialog__main-btns">
            <div
              class="restPwdDialog__main-btn restPwdDialog__main-btn--cancel"
              @click="handleClose(false)"
            >
              取消
            </div>
            <button
              class="restPwdDialog__main-btn restPwdDialog__main-btn--confirm"
              type="submit"
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import { computed } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useDialogStore } from '@/stores/dialogStore';
import { sendResetPasswordMail } from '@/services/UserService';
import { getErrorMessage } from '@/utils/ErrorUtils';
import { withLoading } from '@/utils/loadingUtils';
import { executeApi } from '@/utils/executeApiUtils';

const dialogStore = useDialogStore();

const isOpen = computed(() => dialogStore.isRestPwdDialogOpen);
const customClass = computed(() => dialogStore.customClass);

const schema = yup.object({
  email: yup.string().required('電子信箱為必填'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
  },
});

const [email, emailProps] = defineField('email');

const onSubmit = handleSubmit(async (values) => {
  await executeApi({
    fn: () => sendResetPasswordMail({ email: values.email }),
    successTitle: '成功通知',
    successMessage: '已寄出重設密碼信，請前往信箱確認。',
    errorTitle: '錯誤',
    errorMessage: '寄送失敗，請稍後再試。',
    onSuccess: () => {
      dialogStore.closeRestPwdDialog(true);
    },
  });
});

const handleClose = (result: boolean) => {
  dialogStore.closeRestPwdDialog(result);
};

const handleConfirm = () => {
  dialogStore.closeRestPwdDialog(true);
};
</script>

<style scoped></style>
