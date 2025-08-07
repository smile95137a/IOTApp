<template>
  <div class="category-form">
    <h2 class="form__title">{{ isEdit ? '編輯分類' : '新增分類' }}</h2>
    <form @submit.prevent="onSubmit" class="form">
      <!-- 分類名稱 -->
      <div class="form__group">
        <label class="form__label">分類名稱</label>
        <input v-model="name" class="form__input" />
        <span class="form__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- 分類描述 -->
      <div class="form__group">
        <label class="form__label">描述</label>
        <input v-model="description" class="form__input" />
      </div>
      <!-- 啟用狀態 -->
      <div class="form__group" v-if="isEdit">
        <label class="form__label">啟用</label>
        <input type="checkbox" v-model="status" class="form__checkbox" />
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
          儲存
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { onMounted } from 'vue';
import {
  addCategory,
  fetchCategoryById,
  modifyCategory,
} from '@/services/admin/adminCategoryServices';
import { executeApi } from '@/utils/executeApiUtils';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string | undefined;
const isEdit = !!id;

// 驗證 schema
const schema = object({
  name: string().required('分類名稱為必填'),
});

const { handleSubmit, defineField, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    description: '',
    status: true,
  },
});

const [name] = defineField('name');
const [description] = defineField('description');
const [status] = defineField('status');
const goBack = () => router.push('/admin/mall/categories');

const onSubmit = handleSubmit(async (formValues) => {
  await executeApi({
    fn: () =>
      isEdit ? modifyCategory({ id, ...formValues }) : addCategory(formValues),
    successTitle: '系統通知',
    successMessage: isEdit ? '分類已成功修改！' : '分類已成功新增！',
    errorTitle: '錯誤',
    errorMessage: isEdit
      ? '分類修改失敗，請稍後再試。'
      : '分類新增失敗，請稍後再試。',
    onSuccess: () => {
      goBack();
    },
  });
});

onMounted(async () => {
  if (isEdit && id) {
    try {
      const res = await fetchCategoryById(id);
      if (res.success && res.data) {
        setValues({
          name: res.data.name,
          description: res.data.description,
          status: res.data.status,
        });
      }
    } catch (error) {
      console.error('載入分類失敗', error);
    }
  }
});
</script>
