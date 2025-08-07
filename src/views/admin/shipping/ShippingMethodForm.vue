<template>
  <div class="shipping-form">
    <h1 class="shipping-form__title">
      {{ isEdit ? '編輯物流方式' : '新增物流方式' }}
    </h1>

    <form @submit.prevent="onSubmit" class="shipping-form__form">
      <!-- 名稱 -->
      <div class="form__group">
        <label class="form__label">名稱 *</label>
        <input v-model="name" class="form__input" />
        <span class="form__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- 說明 -->
      <div class="form__group">
        <label class="form__label">說明</label>
        <textarea v-model="description" class="form__input" />
        <span class="form__error" v-if="errors.description">{{
          errors.description
        }}</span>
      </div>

      <!-- 運費 -->
      <div class="form__group">
        <label class="form__label">運費（元） *</label>
        <input type="number" v-model="fee" class="form__input" />
        <span class="form__error" v-if="errors.fee">{{ errors.fee }}</span>
      </div>

      <!-- 狀態 -->
      <div class="form__group">
        <label class="form__label">啟用狀態 *</label>
        <select v-model="status" class="form__input">
          <option :value="true">啟用</option>
          <option :value="false">停用</option>
        </select>
        <span class="form__error" v-if="errors.status">{{
          errors.status
        }}</span>
      </div>

      <!-- 排序 -->
      <div class="form__group">
        <label class="form__label">排序（數字越小越前面）</label>
        <input type="number" v-model="sort" class="form__input" />
        <span class="form__error" v-if="errors.sort">{{ errors.sort }}</span>
      </div>

      <!-- 提交 -->
      <div class="form__actions">
        <button type="submit" class="form__button form__button--primary">
          儲存
        </button>
        <button
          type="button"
          class="form__button form__button--secondary"
          @click="goBack"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { object, string, number, boolean } from 'yup';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  saveShippingMethod,
  fetchShippingMethodList,
} from '@/services/admin/adminOrderServices';
import { executeApi } from '@/utils/executeApiUtils';

const route = useRoute();
const router = useRouter();
const isEdit = !!route.params.id;

// 表單驗證規則
const schema = object({
  id: string().nullable(),
  name: string().required('名稱為必填'),
  description: string().nullable(),
  fee: number().required('運費為必填').min(0, '不得為負數'),
  status: boolean().required('請選擇狀態'),
  sort: number().nullable().default(0),
});

// useForm 初始化
const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    id: '',
    name: '',
    description: '',
    fee: 0,
    status: true,
    sort: 0,
  },
});

// 綁定欄位
const [name] = defineField('name');
const [description] = defineField('description');
const [fee] = defineField('fee');
const [status] = defineField('status');
const [sort] = defineField('sort');

const goBack = () => {
  router.push('/admin/shipping-method');
};

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    ...values,
    id: isEdit ? route.params.id : undefined,
  };

  await executeApi({
    fn: () => saveShippingMethod(payload),
    successTitle: '系統通知',
    successMessage: isEdit ? '物流方式已修改成功！' : '物流方式已新增成功！',
    errorTitle: '錯誤',
    errorMessage: isEdit
      ? '物流方式修改失敗，請稍後再試。'
      : '物流方式新增失敗，請稍後再試。',
    onSuccess: () => {
      goBack();
    },
  });
});

onMounted(async () => {
  if (isEdit) {
    const res = await fetchShippingMethodList();
    const target = res.data.find((item) => item.id === route.params.id);
    if (target) {
      setValues({ ...target });
    }
  }
});
</script>

<style scoped lang="scss">
.shipping-form {
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
}
</style>
