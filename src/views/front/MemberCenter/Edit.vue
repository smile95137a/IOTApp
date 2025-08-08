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

          <!-- 性別 -->
          <div class="form-item">
            <label class="form-label">
              <span>性別</span><span class="required">*</span>
            </label>
            <select v-model="gender">
              <option disabled value="">性別</option>
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
            <div class="error-text">{{ errors.gender }}</div>
          </div>

          <!-- 手機號碼 -->
          <div class="form-item">
            <label class="form-label">
              <span>手機號碼</span><span class="required">*</span>
            </label>
            <input type="tel" v-model="phone" placeholder="請輸入手機號碼" />
            <div class="error-text">{{ errors.phone }}</div>
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

        <!-- 右欄 -->
        <div class="form-right">
          <!-- 頭像 -->
          <div class="upload-box">
            <label class="form-label">上傳頭像照片</label>
            <div class="upload-area" @click="uploadFile('avatar')">
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="onFileChange('avatar', $event)"
                hidden
              />
              <div class="upload-placeholder">上傳頭像照片</div>
              <div class="upload-icons">
                <i class="fas fa-upload"></i>
                <i class="fas fa-camera"></i>
              </div>
            </div>
            <div class="upload-preview" v-if="avatarPreview">
              <img :src="avatarPreview" alt="頭像預覽" class="preview-image" />
            </div>
          </div>
        </div>

        <!-- 送出按鈕 -->
        <div class="form-submit">
          <button type="submit" class="submit-btn">送出</button>
        </div>
      </form>
    </div>
  </MCard>
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

const dialog = useDialogStore();

// 驗證 schema
const schema = yup.object({
  name: yup.string().required('請輸入姓名'),
  anonymousId: yup.string(),
  idNumber: yup.string().required('請輸入證件號'),
  gender: yup.string().required('請選擇性別'),
  phone: yup
    .string()
    .required('請輸入手機號碼')
    .matches(/^09\d{8}$/, '手機號碼格式錯誤'),
  email: yup.string().required('請輸入Email').email('Email格式錯誤'),
});

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: schema,
});

const [name] = defineField('name');
const [anonymousId] = defineField('anonymousId');
const [idNumber] = defineField('idNumber');
const [gender] = defineField('gender');
const [phone] = defineField('phone');
const [email] = defineField('email');

const avatarInput = ref<HTMLInputElement | null>(null);
const idCardInput = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const avatarFile = ref<File | null>(null);
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
        idNumber: user.idNumber || '',
        gender: user.gender || '',
        phone: user.phone || '',
        email: user.email || '',
      });
      if (user.avatarUrl) {
        avatarPreview.value = user.avatarUrl;
      }
    },
    onFail: (data) => {},
  });
});

// 上傳邏輯
const uploadFile = (type: 'avatar' | 'idCard') => {
  if (type === 'avatar') avatarInput.value?.click();
  else if (type === 'idCard') idCardInput.value?.click();
};

const onFileChange = (type: 'avatar' | 'idCard', event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (file) {
    if (type === 'avatar') {
      avatarFile.value = file;
      avatarPreview.value = URL.createObjectURL(file);
    }
    console.log(`${type} uploaded:`, file);
  }
};

// ✅ 表單送出
const onSubmit = handleSubmit(async (values) => {
  await executeApi({
    fn: () =>
      updateUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        anonymousId: values.anonymousId,
        gender: values.gender,
        idNumber: values.idNumber,
      }),
    onSuccess: async (data) => {
      if (avatarFile.value && localUserId.value) {
        const success = await uploadProfileImage(
          localUserId.value,
          avatarFile.value
        );
        if (!success) {
          dialog.openInfoDialog({ title: '錯誤', message: '頭像上傳失敗' });
          return;
        }
      }
    },
  });
});
</script>

<style scoped>
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
</style>
