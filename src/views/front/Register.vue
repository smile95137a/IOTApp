<script setup lang="ts">
import MCard from '@/components/common/MCard.vue';

import { register } from '@/services/UserService';
import { useDialogStore } from '@/stores/dialogStore';
import { executeApi } from '@/utils/executeApiUtils';
import { useForm } from 'vee-validate';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import * as yup from 'yup';

import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { uploadProfileImage } from '@/services/UsersService';
import { loginUser } from '@/services/LoginService';
import { useAuthFrontStore } from '@/stores/authFrontStore';
const authStore = useAuthFrontStore();
const dialogStore = useDialogStore();
const router = useRouter();

const schema = yup.object({
  email: yup.string().required('請輸入電子信箱').email('電子信箱格式不正確'),
  phone: yup.string().required('請輸入手機號碼'),
  password: yup.string().required('請輸入密碼').min(6, '密碼至少 6 碼'),
  confirmPassword: yup
    .string()
    .required('請再次輸入密碼')
    .oneOf([yup.ref('password')], '密碼不一致'),
  name: yup.string().required('請輸入姓名'),
  gender: yup.string().required('請選擇性別'),
  anonymousId: yup.string(), // 可選填
  agreeTerms: yup
    .boolean()
    .oneOf([true], '請勾選同意條款')
    .required('請勾選同意條款'),
});

const { defineField, handleSubmit, errors, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '', // from nickName
    gender: '',
    anonymousId: '',
    agreeTerms: false,
  },
});

const [email, emailProps] = defineField('email');
const [phone, phoneProps] = defineField('phone');
const [password, passwordProps] = defineField('password');
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword');
const [name, nameProps] = defineField('name'); // ← 替代 nickName
const [gender, genderProps] = defineField('gender'); // ← 新增
const [anonymousId, anonymousIdProps] = defineField('anonymousId'); // ← 新增
const [agreeTerms, agreeTermsProps] = defineField('agreeTerms');

const onSubmit = handleSubmit(async (values) => {
  if (values.password !== values.confirmPassword) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: '密碼與確認密碼不一致',
      confirmText: '我知道了',
    });
    return;
  }

  const userData = {
    name: values.name,
    password: values.password,
    gender: values.gender,
    anonymousId: values.anonymousId,
    email: values.email,
    phone: values.phone,
    countryCode: '+886',
    verificationCode: '',
  };

  await executeApi({
    fn: () => register(userData),
    onSuccess: async (data) => {
      const userId = data.id;
      if (croppedImage.value) {
        const uploadSuccess = await uploadProfileImage(
          userId,
          croppedImage.value
        );
        if (!uploadSuccess) {
          await dialogStore.openInfoDialog({
            title: '錯誤',
            message: '頭像上傳失敗，請稍後再試',
            confirmText: '我知道了',
          });
        }
      }
    },
    errorMessage: '註冊失敗，請稍後再試',
  });

  await executeApi({
    fn: () =>
      loginUser({
        type: 'email',
        email: values.email,
        password: values.password,
      }),
    onSuccess: async (data) => {
      const { accessToken, user } = data;
      await dialogStore.openInfoDialog({
        title: '註冊成功',
        message: '歡迎加入 🙌',
        confirmText: '前往首頁',
      });
      authStore.setUser(data.user);
      authStore.setToken(data.accessToken);
      router.push('/home');
    },
    errorMessage: '帳號已建立，請手動登入',
  });
});

const rawImage = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const showCropDialog = ref(false);
const cropperRef = ref<any>(null);

const onImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    rawImage.value = reader.result as string;
    showCropDialog.value = true;
  };
  reader.readAsDataURL(file);
};

const confirmCrop = () => {
  const cropper = cropperRef.value?.getResult?.();
  if (cropper?.canvas) {
    croppedImage.value = cropper.canvas.toDataURL('image/jpeg');
    showCropDialog.value = false;
  }
};

const cancelCrop = () => {
  showCropDialog.value = false;
  rawImage.value = null;
};
</script>
<template>
  <div class="register">
    <div class="register__container">
      <MCard customClass="mcard--login login__card">
        <form @submit="onSubmit">
          <div class="register__content">
            <div class="register__main">
              <div class="register__form">
                <div class="register__form-inputs">
                  <p class="register__text register__text--required">信箱</p>
                  <input
                    class="register__form-input"
                    v-model="email"
                    v-bind="emailProps"
                    :class="{ 'register__form-input--error': errors.email }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.email }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">手機</p>
                  <input
                    class="register__form-input"
                    v-model="phone"
                    v-bind="phoneProps"
                    :class="{
                      'register__form-input--error': errors.phone,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.phone }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">密碼</p>
                  <input
                    class="register__form-input"
                    type="password"
                    v-model="password"
                    v-bind="passwordProps"
                    :class="{ 'register__form-input--error': errors.password }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.password }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">
                    確認密碼
                  </p>
                  <input
                    class="register__form-input"
                    type="password"
                    v-model="confirmPassword"
                    v-bind="confirmPasswordProps"
                    :class="{
                      'register__form-input--error': errors.confirmPassword,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.confirmPassword }}
                  </p>
                </div>
                <div class="register__form-inputs m-t-20">
                  <p class="register__text register__text--required">姓名</p>
                  <input
                    class="register__form-input"
                    v-model="name"
                    v-bind="nameProps"
                    :class="{ 'register__form-input--error': errors.name }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.name }}
                  </p>
                </div>

                <div class="register__form-inputs">
                  <p class="register__text register__text--required">性別</p>
                  <select
                    class="register__form-input"
                    v-model="gender"
                    v-bind="genderProps"
                    :class="{ 'register__form-input--error': errors.gender }"
                  >
                    <option value="">請選擇</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                  <p class="register__text register__text--error">
                    {{ errors.gender }}
                  </p>
                </div>
                <div class="register__form-inputs">
                  <p class="register__text">暱稱</p>
                  <input
                    class="register__form-input"
                    v-model="anonymousId"
                    v-bind="anonymousIdProps"
                    :class="{
                      'register__form-input--error': errors.anonymousId,
                    }"
                  />
                  <p class="register__text register__text--error">
                    {{ errors.anonymousId }}
                  </p>
                </div>
              </div>
              <div class="register__divider">
                <div class="register__divider-line"></div>
              </div>
              <div class="register__form">
                <div class="avatar-upload">
                  <label class="avatar-upload__label">
                    <!-- ✅ 隱藏 input -->
                    <input
                      type="file"
                      accept="image/*"
                      @change="onImageChange"
                      class="avatar-upload__input"
                    />

                    <div class="avatar-upload__inner">
                      <img
                        v-if="croppedImage"
                        :src="croppedImage"
                        alt="預覽圖片"
                        class="avatar-upload__preview"
                      />

                      <p class="avatar-upload__text">上傳頭像照片</p>
                      <div class="avatar-upload__icons">
                        <div class="avatar-upload__icon">
                          <i class="fas fa-upload"></i>
                        </div>
                        <div class="avatar-upload__icon">
                          <i class="fas fa-camera"></i>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div v-if="showCropDialog" class="avatar-crop-dialog">
              <div class="avatar-crop-dialog__overlay" @click="cancelCrop" />
              <div class="avatar-crop-dialog__content">
                <Cropper
                  ref="cropperRef"
                  :src="rawImage"
                  class="avatar-cropper"
                  :stencil-props="{ aspectRatio: 1 }"
                />
                <div class="avatar-crop-dialog__buttons">
                  <button @click="confirmCrop">確認裁切</button>
                  <button @click="cancelCrop">取消</button>
                </div>
              </div>
            </div>

            <div class="register__other">
              <div class="register__checkbox">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  v-model="agreeTerms"
                  :class="{ 'register__checkbox--error': errors.agreeTerms }"
                />
                <label for="agreeTerms" class="register__agreeTerms-text">
                  我同意 <u>想撞球</u> 提供的
                  <u><a href="./policy" target="_blank">網站服務條款</a></u>
                  與
                  <u> <a href="./privacy" target="_blank">隱私權政策</a></u>
                  。
                </label>
              </div>
              <p class="register__text register__text--error">
                {{ errors.agreeTerms }}
              </p>
              <div class="register__other-btn">
                <button type="submit" class="register__btn">
                  註冊成為會員
                </button>
              </div>
            </div>
          </div>
        </form>
      </MCard>
    </div>
  </div>
</template>
<style scoped lang="scss">
.avatar-upload {
  border: 1px solid #aaaaaa;
  border-radius: 10px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &__label {
    display: block;
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; // 正方形容器
  }

  &__input {
    display: none;
  }

  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    border-radius: 10px;
  }

  &__text,
  &__icons {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    color: #aaa;
  }

  &__text {
    top: 20%;
    font-size: 16px;
  }

  &__icons {
    bottom: 20%;
    display: flex;
    justify-content: center;
    gap: 1.5rem;
  }

  &__icon {
    width: 56px;
    height: 56px;
    background: #d9d9d9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      font-size: 28px;
      color: #666666;
    }
  }
}

// 裁切 Dialog
.avatar-crop-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;

  &__overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 320px;
    max-width: 90%;
    background: white;
    padding: 1rem;
    border-radius: 12px;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  &__buttons {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;

    button {
      padding: 0.5rem 1rem;
      background: #007aff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;

      &:last-child {
        background: #ccc;
        color: #333;
      }
    }
  }
}

.avatar-cropper {
  width: 100%;
  height: 300px;
}
</style>
