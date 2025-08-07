<template>
  <div class="master-form">
    <h1 class="master-form__title">
      {{ isEdit ? '編輯老師' : '新增老師' }}
    </h1>

    <form @submit.prevent="onSubmit" class="form">
      <!-- 老師代號 -->
      <div class="form__group">
        <label class="form__label">老師代號</label>
        <input v-model="code" class="form__input" :readonly="isEdit" />
        <span class="form__error" v-if="errors.code">{{ errors.code }}</span>
      </div>

      <!-- 老師名字 -->
      <div class="form__group">
        <label class="form__label">老師名字</label>
        <input v-model="name" class="form__input" />
        <span class="form__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- 老師頭銜 -->
      <div class="form__group">
        <label class="form__label">老師頭銜</label>
        <input v-model="title" class="form__input" />
      </div>

      <!-- 老師主星 -->
      <div class="form__group">
        <label class="form__label">老師主星</label>
        <input v-model="mainStar" class="form__input" />
      </div>

      <!-- 老師簡介 -->
      <div class="form__group">
        <label class="form__label">老師簡介</label>
        <textarea v-model="bio" class="form__input"></textarea>
      </div>

      <!-- 老師學經歷 -->
      <div class="form__group">
        <label class="form__label">老師學經歷</label>
        <textarea v-model="experience" class="form__input"></textarea>
      </div>

      <!-- 老師親算項目 -->
      <div class="form__group">
        <label class="form__label">老師親算項目</label>
        <input v-model="personalItems" class="form__input" />
      </div>

      <!-- 老師服務項目 -->
      <!-- 老師服務項目 -->
      <div class="form__group">
        <label class="form__label">老師服務項目</label>
        <div
          v-for="(item, index) in serviceItem"
          :key="index"
          class="form__group--nested"
        >
          <div class="form__field">
            <label class="form__label">項目標題</label>
            <input
              v-model="item.title"
              class="form__input"
              placeholder="例如：流年運勢解析"
            />
          </div>

          <div class="form__field">
            <label class="form__label">項目內容</label>
            <textarea
              v-model="item.content"
              class="form__input"
              placeholder="請輸入服務內容"
            ></textarea>
          </div>

          <div class="form__field">
            <label class="form__label">項目價格</label>
            <input
              v-model="item.price"
              type="number"
              class="form__input"
              placeholder="請輸入價格（例如：2000）"
            />
          </div>

          <div class="form__actions--inline">
            <button
              type="button"
              class="form__button form__button--delete"
              @click="removeServiceItem(index)"
            >
              刪除此項目
            </button>
          </div>
        </div>

        <button
          type="button"
          class="form__button form__button--secondary"
          @click="addServiceItem"
        >
          新增服務項目
        </button>
      </div>

      <!-- 老師排序 -->
      <div class="form__group">
        <label class="form__label">老師排序</label>
        <input type="number" v-model="sort" class="form__input" />
        <span class="form__error" v-if="errors.sort">{{ errors.sort }}</span>
      </div>

      <!-- 老師是否在架上 -->
      <div class="form__group">
        <label class="form__label">老師是否在架上</label>
        <input type="checkbox" v-model="status" />
      </div>

      <!-- 老師圖像（Base64） -->
      <div class="form__group">
        <label class="form__label">老師圖像（Base64）</label>
        <input type="file" @change="onImageChange" class="form__input" />
        <img v-if="imageBase64" :src="imageBase64" class="form__preview-img" />
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
import { object, string, number, boolean } from 'yup';
import { useForm } from 'vee-validate';
import {
  addMaster,
  modifyMaster,
  fetchAllMasters,
  fetchMasterByCode,
} from '@/services/admin/adminMasterServices';
import { executeApi } from '@/utils/executeApiUtils';

const router = useRouter();
const route = useRoute();
const id = route.params.id as string | undefined;
const isEdit = !!id;

const schema = object({
  name: string().required('老師名字為必填'),
  sort: number().required('老師排序為必填').min(0, '老師排序不可小於 0'),
  status: boolean().required(),
});

const { handleSubmit, errors, defineField, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    code: '',
    name: '',
    title: '',
    mainStar: '',
    bio: '',
    experience: '',
    personalItems: '',
    serviceItem: [],
    status: true,
    imageBase64: '',
    sort: 0,
  },
});

const [code] = defineField('code');
const [name] = defineField('name');
const [title] = defineField('title');
const [mainStar] = defineField('mainStar');
const [bio] = defineField('bio');
const [experience] = defineField('experience');
const [personalItems] = defineField('personalItems');
const [serviceItem] = defineField('serviceItem');
const [status] = defineField('status');
const [imageBase64] = defineField('imageBase64');
const [sort] = defineField('sort');

const addServiceItem = () => {
  serviceItem.value.push({ title: '', content: '', price: 0 });
};

const removeServiceItem = (index: number) => {
  serviceItem.value.splice(index, 1);
};

const goBack = () => router.push('/admin/masters');

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
  const payload = {
    ...formValues,
    id: isEdit ? id : undefined,
  };

  await executeApi({
    fn: () => (isEdit ? modifyMaster(payload) : addMaster(payload)),
    successTitle: '系統通知',
    successMessage: isEdit ? '老師資料已成功修改！' : '老師資料已成功新增！',
    errorTitle: '錯誤',
    errorMessage: isEdit
      ? '老師資料修改失敗，請稍後再試。'
      : '老師資料新增失敗，請稍後再試。',
    onSuccess: () => {
      goBack();
    },
  });
});

const loadData = async () => {
  if (!id) return;

  try {
    const res = await fetchMasterByCode(id);
    if (res.success && res.data) {
      const target = res.data;

      setValues({
        code: target.code,
        name: target.name,
        title: target.title,
        mainStar: target.mainStar,
        bio: target.bio,
        experience: target.experience,
        personalItems: target.personalItems,
        serviceItem:
          target.serviceItem?.map((item) => ({
            title: item.title || '',
            content: item.content || '',
            price: item.price || 0,
          })) ?? [],
        status: target.status,
        imageBase64: target.imageBase64,
        sort: target.sort,
      });
    }
  } catch (error) {
    console.error('loadData error:', error);
  }
};

onMounted(() => {
  if (isEdit) loadData();
});
</script>

<style scoped lang="scss">
.master-form {
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

  .form__group {
    margin-bottom: 24px;

    &--nested {
      margin-bottom: 16px;
      background: #f9f9f9;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
  }

  .form__label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
  }

  .form__input {
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      border-color: #888;
      outline: none;
    }
  }

  .form__error {
    color: #d93025;
    font-size: 14px;
    margin-top: 4px;
    display: block;
  }

  .form__field {
    margin-bottom: 12px;
  }

  .form__actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }

  .form__actions--inline {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }

  .form__button {
    padding: 8px 16px;
    border: none;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;

    &--primary {
      background-color: #eb6c4d;
      color: #fff;

      &:hover {
        background-color: #d85c3c;
      }
    }

    &--secondary {
      background-color: #f0f0f0;
      color: #333;

      &:hover {
        background-color: #e0e0e0;
      }
    }

    &--delete {
      background-color: #fdd;
      color: #b00;

      &:hover {
        background-color: #fbb;
      }
    }
  }

  .form__preview-img {
    max-width: 100%;
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
}
</style>
