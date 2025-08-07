<template>
  <div class="banner-form">
    <h1 class="banner-form__title">
      {{ isEdit ? '編輯 Banner' : '新增 Banner' }}
    </h1>

    <form @submit.prevent="onSubmit" class="form">
      <!-- 連結 -->
      <div class="form__group">
        <label class="form__label">連結</label>
        <input v-model="url" class="form__input" />
        <span class="form__error" v-if="errors.url">{{ errors.url }}</span>
      </div>

      <!-- 排序 -->
      <div class="form__group">
        <label class="form__label">排序</label>
        <input type="number" v-model="sort" class="form__input" />
        <span class="form__error" v-if="errors.sort">{{ errors.sort }}</span>
      </div>

      <!-- 圖片 -->
      <div class="form__group">
        <label class="form__label">圖片</label>
        <input type="file" @change="onImageChange" class="form__input" />
        <span class="form__error" v-if="errors.imageBase64">{{
          errors.imageBase64
        }}</span>
        <img v-if="imageBase64" :src="imageBase64" class="form__preview-img" />
      </div>

      <!-- 類型 -->
      <div class="form__group">
        <label class="form__label">類型</label>
        <select v-model="type" class="form__input">
          <option value="A">主 banner</option>
          <option value="B">會員好康</option>
        </select>
        <span class="form__error" v-if="errors.type">{{ errors.type }}</span>
      </div>

      <!-- 上架日期 -->
      <div class="form__group">
        <label class="form__label">上架日期</label>
        <input type="date" v-model="availableFrom" class="form__input" />
        <span class="form__error" v-if="errors.availableFrom">{{
          errors.availableFrom
        }}</span>
      </div>

      <!-- 下架日期 -->
      <div class="form__group">
        <label class="form__label">下架日期</label>
        <input type="date" v-model="availableUntil" class="form__input" />
        <span class="form__error" v-if="errors.availableUntil">{{
          errors.availableUntil
        }}</span>
      </div>

      <!-- 說明 -->
      <div class="form__group">
        <label class="form__label">說明</label>
        <input v-model="description" class="form__input" />
        <span class="form__error" v-if="errors.description">{{
          errors.description
        }}</span>
      </div>

      <!-- 按鈕 -->
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
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { object, string, number } from 'yup';
import { useForm } from 'vee-validate';
import {
  addBanner,
  fetchBannerById,
  modifyBanner,
} from '@/services/admin/adminBannerServices';
import moment from 'moment';
import { executeApi } from '@/utils/executeApiUtils';

const router = useRouter();
const route = useRoute();
const id = route.params.id as string | undefined;
const isEdit = !!id;

const schema = object({
  filename: string().required('請上傳圖片'),
  sort: number().required('排序為必填').min(0, '排序不可小於 0'),
  type: string().oneOf(['A', 'B']).required('類型為必填'),
  availableFrom: string().required('上架日期為必填'),
  availableUntil: string().required('下架日期為必填'),
  url: string().url('請輸入有效的連結').nullable(),
  description: string().nullable(),
  imageBase64: string().required('請上傳圖片'),
});

const { handleSubmit, errors, defineField, setValues, values } = useForm({
  validationSchema: schema,
  initialValues: {
    filename: '',
    sort: 1,
    type: 'A',
    availableFrom: '',
    availableUntil: '',
    url: '',
    description: '',
    imageBase64: '',
  },
});

// defineField - 綁定每個欄位
const [filename] = defineField('filename');
const [sort] = defineField('sort');
const [type] = defineField('type');
const [availableFrom] = defineField('availableFrom');
const [availableUntil] = defineField('availableUntil');
const [url] = defineField('url');
const [description] = defineField('description');
const [imageBase64] = defineField('imageBase64');

const goBack = () => router.push('/admin/banners');

const onImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imageBase64.value = reader.result as string;
    filename.value = file.name;
  };
  reader.readAsDataURL(file);
};

const onSubmit = handleSubmit(async (formValues) => {
  const payload = {
    ...formValues,
    availableFrom: moment(formValues.availableFrom).format('YYYY/MM/DD'),
    availableUntil: moment(formValues.availableUntil).format('YYYY/MM/DD'),
    id: isEdit ? id : undefined,
  };

  await executeApi({
    fn: () => (isEdit ? modifyBanner(payload) : addBanner(payload)),
    successTitle: '系統通知',
    successMessage: isEdit ? '橫幅已成功修改！' : '橫幅已成功新增！',
    errorTitle: '錯誤',
    errorMessage: isEdit
      ? '橫幅修改失敗，請稍後再試。'
      : '橫幅新增失敗，請稍後再試。',
    onSuccess: () => {
      goBack();
    },
  });
});

const loadData = async () => {
  if (!id) return;
  const res = await fetchBannerById(id);
  if (res.success) {
    const data = res.data;
    setValues({
      url: data.url || '',
      sort: data.sort,
      imageBase64: data.imageBase64,
      filename: data.filename ?? 'banner.jpg',
      type: data.type,
      availableFrom: moment(data.availableFrom).format('YYYY-MM-DD'),
      availableUntil: moment(data.availableUntil).format('YYYY-MM-DD'),
      description: data.description ?? '',
    });
  }
};

onMounted(() => {
  if (isEdit) loadData();
});
</script>

<style scoped lang="scss">
.banner-form {
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
