<template>
  <div class="login">
    <div class="login__wrapper">
      <h2 class="login__title">會員登入</h2>
      <div class="login__container">
        <div class="login__main">
          <div class="login__left">
            <div v-if="!isStart" class="login__auths">
              <div class="login__auths">
                <button
                  class="login__auth-btn"
                  :class="{ active: loginType === 'email' }"
                  @click="startLogin('email')"
                >
                  <div class="login__auth-btn-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <div class="login__auth-btn-text">Email 登入</div>
                </button>

                <button
                  class="login__auth-btn"
                  :class="{ active: loginType === 'phone' }"
                  @click="startLogin('phone')"
                >
                  <div class="login__auth-btn-icon">
                    <i class="fas fa-mobile-alt"></i>
                  </div>
                  <div class="login__auth-btn-text">手機登入</div>
                </button>
              </div>

              <div class="login__divider">
                <div class="login__divider-line" />
                <div class="login__divider-text">或</div>
              </div>
              <div class="login__auth">
                <div class="login__auth-btn" @click="handleOauth('google')">
                  <div class="login__auth-btn-icon">
                    <i class="fab fa-google"></i>
                  </div>
                  <div class="login__auth-btn-text">Google 帳號登入</div>
                </div>
                <div class="login__auth-btn" @click="handleOauth('facebook')">
                  <div class="login__auth-btn-icon">
                    <i class="fab fa-facebook-f"></i>
                  </div>
                  <div class="login__auth-btn-text">Facebook 登入</div>
                </div>
                <div class="login__auth-btn" @click="handleOauth('apple')">
                  <div class="login__auth-btn-icon">
                    <i class="fab fa-apple"></i>
                  </div>
                  <div class="login__auth-btn-text">Apple ID 登入</div>
                </div>
              </div>
            </div>

            <form v-else class="login__form" @submit.prevent="onSubmit">
              <div class="login__form-inputs" v-if="loginType === 'email'">
                <p class="login__text">電子信箱</p>
                <input
                  v-model="email"
                  v-bind="emailAttrs"
                  type="email"
                  class="login__form-input"
                  placeholder="請輸入電子信箱"
                />
                <p class="error-text" v-if="errors.email">{{ errors.email }}</p>
              </div>

              <div class="login__form-inputs" v-if="loginType === 'phone'">
                <p class="login__text">手機號碼</p>
                <div style="display: flex; gap: 8px">
                  <select
                    v-model="countryCode"
                    v-bind="countryCodeAttrs"
                    class="login__form-input"
                    style="max-width: 100px"
                  >
                    <option value="+886">+886（台灣）</option>
                    <option value="+81">+81（日本）</option>
                    <option value="+82">+82（韓國）</option>
                    <option value="+1">+1（美國）</option>
                  </select>
                  <input
                    v-model="phone"
                    v-bind="phoneAttrs"
                    type="tel"
                    class="login__form-input"
                    placeholder="請輸入手機號碼"
                  />
                </div>
                <p class="error-text" v-if="errors.phone">{{ errors.phone }}</p>
              </div>

              <div class="login__form-inputs">
                <p class="login__text">密碼</p>
                <input
                  v-model="password"
                  v-bind="passwordAttrs"
                  type="password"
                  class="login__form-input"
                  placeholder="請輸入密碼"
                />
                <p class="error-text" v-if="errors.password">
                  {{ errors.password }}
                </p>
              </div>

              <div class="login__forgot">
                <p
                  class="login__text login__text--forgot"
                  @click="handleForgot"
                >
                  忘記密碼?
                </p>
              </div>

              <div class="login__btns">
                <button type="submit" class="login__btn">
                  {{ loading ? '登入中...' : '登入' }}
                </button>
              </div>
            </form>
          </div>

          <div class="login__right">
            <div class="login__other">
              <div class="login__other-img">
                <img :src="logo" alt="Logo" />
              </div>
              <div class="login__other-info">
                <p class="login__text">
                  尚未加入會員？點此
                  <span class="login__register-link" @click="toRegister">
                    註冊
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLoginUrl } from '@/utils/AuthUtils';
import logo from '@/assets/image/i-Pool_logo_RGB_2.png';
import { useForm } from 'vee-validate';
import { executeApi } from '@/utils/executeApiUtils';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { loginUser } from '@/services/LoginService';

const route = useRoute();
const router = useRouter();
const authStore = useAuthFrontStore();

const isStart = ref(false);
const loading = ref(false);

const loginType = ref<'email' | 'phone' | null>(
  (route?.state?.loginType as 'email' | 'phone') || null
);

const { handleSubmit, errors, defineField } = useForm({
  initialValues: {
    email: '',
    phone: '',
    countryCode: '+886',
    password: '',
  },
});

const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');
const [countryCode, countryCodeAttrs] = defineField('countryCode');
const [password, passwordAttrs] = defineField('password');

const startLogin = (type: 'email' | 'phone') => {
  loginType.value = type;
  isStart.value = true;
};

const handleOauth = (provider: string) => {
  window.location.href = getLoginUrl(provider);
};

const onSubmit = handleSubmit(async (values) => {
  const loginData =
    loginType.value === 'phone'
      ? {
          type: 'phone',
          countryCode: values.countryCode,
          phone: values.phone,
          password: values.password,
        }
      : {
          type: 'email',
          email: values.email,
          password: values.password,
        };

  await executeApi({
    fn: () => loginUser(loginData),
    onSuccess: (data) => {
      authStore.setUser(data.user);
      authStore.setToken(data.accessToken);
      router.push('/home');
    },
  });
});

const handleForgot = () => {
  // TODO: 忘記密碼邏輯
};

const toRegister = () => {
  router.push('/register');
};
</script>
