<template>
  <MCard>
    <div class="personal-info">
      <h2 class="personal-info__title">個人資料</h2>

      <form @submit.prevent="onSubmit" class="personal-info__form">
        <!-- 左欄 -->
        <div class="form-left">
          <!-- 姓名 -->
          <div class="form-item">
            <label class="form-label">
              <span>姓名</span><span class="required">*</span>
            </label>
            <input type="text" v-model="name" placeholder="請輸入真實姓名" />
            <div class="error-text">{{ errors.name }}</div>
          </div>

          <!-- 暱稱 -->
          <div class="form-item">
            <label class="form-label">暱稱</label>
            <input type="text" v-model="anonymousId" placeholder="請輸入暱稱" />
          </div>

          <!-- Email -->
          <div class="form-item">
            <label class="form-label">
              <span>Email信箱</span><span class="required">*</span>
            </label>
            <input type="email" v-model="email" placeholder="請輸入Email信箱" />
            <div class="error-text">{{ errors.email }}</div>
          </div>
        </div>

        <div class="form-right">
          <div class="avatar-upload">
            <label class="avatar-upload__label">
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

        <!-- 送出按鈕 -->
        <div class="form-submit">
          <button type="submit" class="submit-btn">送出</button>
        </div>
      </form>
    </div>
  </MCard>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import MCard from '@/components/common/MCard.vue';
import { useDialogStore } from '@/stores/dialogStore';
import { executeApi } from '@/utils/executeApiUtils';
import {
  getUserInfo,
  updateUser,
  uploadProfileImage,
} from '@/services/UsersService';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { useRouter } from 'vue-router';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();
const router = useRouter();

// 驗證 schema
const schema = yup.object({
  name: yup.string().required('請輸入姓名'),
  anonymousId: yup.string(),
  email: yup.string().required('請輸入Email').email('Email格式錯誤'),
});

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: schema,
});

const [name] = defineField('name');
const [anonymousId] = defineField('anonymousId');
const [email] = defineField('email');

const localUserId = ref<number | null>(null);

// 初始化使用者資料
onMounted(async () => {
  await executeApi({
    fn: () => getUserInfo(),
    onSuccess: (data) => {
      const user = data;
      localUserId.value = user.id;
      setValues({
        name: user.name,
        anonymousId: user.anonymousId || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    },
    onFail: (data) => {},
  });
});

const onSubmit = handleSubmit(async (values) => {
  if (!values.name || !values.email) {
    await dialogStore.openInfoDialog({
      title: '錯誤',
      message: '請填寫所有必填欄位',
      confirmText: '我知道了',
    });
    return;
  }

  const userData = {
    name: values.name,
    anonymousId: values.anonymousId,
    email: values.email,
  };

  await executeApi({
    fn: () => updateUser(userData),
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

  if (values.email !== authStore.user.email) {
    await dialogStore.openInfoDialog({
      title: '訊息',
      message: '已更改 email，請重新登入',
      confirmText: '確定',
    });
    authStore.clearAuthData();
    router.push('/home');
  }
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

<style scoped lang="scss">
.personal-info {
  padding: 2rem;
}

.personal-info__title {
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.personal-info__form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-left,
.form-right {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  color: #000;
}

input,
select {
  padding: 0.5rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.required {
  color: red;
}

.error-text {
  color: red;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.upload-box {
  display: flex;
  flex-direction: column;
}

.upload-area {
  margin-top: 0.5rem;
  height: 160px;
  background-color: #f8f8f8;
  border: 1px dashed #aaa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.upload-placeholder {
  color: #aaa;
  font-size: 0.9rem;
}

.upload-icons {
  font-size: 1.5rem;
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.upload-icons i {
  color: #888;
}

.upload-preview {
  margin-top: 0.5rem;
}

.preview-image {
  width: 160px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.form-submit {
  grid-column: span 2;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.submit-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  background-color: #3f2412;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

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
