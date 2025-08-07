<template>
  <div class="adminlogin">
    <h1 class="adminlogin__title">管理員登入</h1>
    <form class="adminlogin__form" @submit.prevent="onSubmit">
      <div class="adminlogin__field">
        <label for="username">電子信箱</label>
        <input id="username" v-model="username" type="text" />
        <span class="adminlogin__error" v-if="errors.username">{{
          errors.username
        }}</span>
      </div>

      <div class="adminlogin__field">
        <label for="password">密碼</label>
        <input id="password" v-model="password" type="password" />
        <span class="adminlogin__error" v-if="errors.password">{{
          errors.password
        }}</span>
      </div>

      <div class="adminlogin__btn-wrapper">
        <button class="adminlogin__btn" type="submit">登入</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { login } from '@/services/UserService';
import { useAuthAdminStore } from '@/stores/authAdminStore';
import { useRouter } from 'vue-router';
import { withLoading } from '@/utils/loadingUtils';

const authStore = useAuthAdminStore();
const router = useRouter();

const schema = yup.object({
  username: yup.string().required('電子信箱為必填'),
  password: yup.string().required('密碼為必填'),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    username: '',
    password: '',
  },
});

const [username] = defineField('username');
const [password] = defineField('password');

const onSubmit = handleSubmit(async (values) => {
  try {
    const { success, data, message } = await withLoading(() => login(values));
    if (success) {
      authStore.setToken(data.accessToken);
      // authStore.setUser(data.user);
      router.push('/admin');
    }
  } catch (error) {
    console.error('登入失敗', error);
  }
});
</script>

<style scoped lang="scss">
.adminlogin {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

  &__title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__field {
    display: flex;
    flex-direction: column;

    label {
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 6px;
    }
  }

  &__error {
    color: #e85028;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  &__btn-wrapper {
    text-align: center;
  }

  &__btn {
    background-color: #a53b25;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-weight: bold;
    border-radius: 999px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background-color: #892d1f;
    }
  }
}
</style>
