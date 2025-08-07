<template>
  <div class="offering-form">
    <h1 class="offering-form__title">
      {{ isEdit ? '編輯供品' : '新增供品' }}
    </h1>

    <form @submit.prevent="onSubmit" class="form">
      <!-- 供品名稱 -->
      <div class="form__group">
        <label class="form__label">供品名稱</label>
        <input v-model="name" class="form__input" />
        <span class="form__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- 價格 -->
      <div class="form__group">
        <label class="form__label">價格</label>
        <input type="number" v-model="price" class="form__input" />
        <span class="form__error" v-if="errors.price">{{ errors.price }}</span>
      </div>

      <!-- 經驗值 -->
      <div class="form__group">
        <label class="form__label">獲得經驗值</label>
        <input type="number" v-model="points" class="form__input" />
        <span class="form__error" v-if="errors.points">{{
          errors.points
        }}</span>
      </div>

      <!-- 圖片上傳 -->
      <div class="form__group">
        <label class="form__label">圖片</label>
        <input type="file" @change="onImageChange" class="form__input" />
        <span class="form__error" v-if="errors.imageBase64">{{
          errors.imageBase64
        }}</span>
        <img v-if="imageBase64" :src="imageBase64" class="form__preview-img" />
      </div>

      <!-- 操作按鈕 -->
      <div class="form__actions">
        <button
          type="button"
          class="form__button form__button--secondary"
          @click="goBack"
        >
          取消
        </button>
        <button type="submit" class="form__button form__button--primary">
          {{ isEdit ? '更新' : '新增' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { object, string, number } from 'yup';
import { onMounted } from 'vue';
import {
  addOffering,
  fetchOfferingList,
  modifyOffering,
} from '@/services/admin/adminOfferingServices';
import type { OfferingVO } from '@/vite-env';
import { executeApi } from '@/utils/executeApiUtils';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string | undefined;
const isEdit = !!id;

// 表單驗證 schema
const schema = object({
  name: string().required('供品名稱為必填'),
  price: number().required('價格為必填').min(0, '價格不可小於 0'),
  points: number().required('經驗值為必填').min(0, '經驗值不可小於 0'),
  imageBase64: string().required('請上傳圖片'),
});

const { handleSubmit, defineField, errors, setValues, values } =
  useForm<OfferingVO>({
    validationSchema: schema,
    initialValues: {
      id: '',
      name: '',
      price: 0,
      points: 0,
      imageBase64: '',
    },
  });

const [name] = defineField('name');
const [price] = defineField('price');
const [points] = defineField('points');
const [imageBase64] = defineField('imageBase64');

const goBack = () => router.push('/admin/offerings');

const onImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imageBase64.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const onSubmit = handleSubmit(async (formValues) => {
  const payload: OfferingVO = {
    ...formValues,
    id: isEdit ? id : undefined,
  };

  await executeApi({
    fn: () => (isEdit ? modifyOffering(payload) : addOffering(payload)),
    successTitle: '系統通知',
    successMessage: isEdit ? '供品已成功修改！' : '供品已成功新增！',
    errorTitle: '錯誤',
    errorMessage: isEdit
      ? '供品修改失敗，請稍後再試。'
      : '供品新增失敗，請稍後再試。',
    onSuccess: () => {
      goBack();
    },
  });
});

onMounted(async () => {
  if (isEdit && id) {
    try {
      const res = await fetchOfferingList();
      if (res.success) {
        const target = res.data.find((item) => item.id === id);
        if (target) {
          setValues(target);
        }
      }
    } catch (err) {
      console.error('供品載入失敗', err);
    }
  }
});
</script>

<style scoped lang="scss">
.offering-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  &__title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    text-align: center;
  }

  .form__preview-img {
    margin-top: 12px;
    max-height: 100px;
    border: 1px solid #ddd;
    border-radius: 6px;
  }
}
</style>
