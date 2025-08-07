<template>
  <div class="product-form">
    <h2 class="form__title">{{ isEdit ? '編輯商品' : '新增商品' }}</h2>
    <form @submit.prevent="onSubmit" class="form">
      <!-- 商品名稱 -->
      <div class="form__group">
        <label class="form__label">商品名稱</label>
        <input v-model="name" class="form__input" />
        <span class="form__error" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <!-- 所屬分類 -->
      <!-- 所屬分類 -->
      <div class="form__group">
        <label class="form__label">所屬分類</label>
        <select v-model="categoryId" class="form__input">
          <option disabled value="">請選擇分類</option>
          <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <span class="form__error" v-if="errors.categoryId">{{
          errors.categoryId
        }}</span>
      </div>

      <!-- 副標題 -->
      <div class="form__group">
        <label class="form__label">副標題</label>
        <input v-model="subtitle" class="form__input" />
      </div>

      <!-- 描述 -->
      <div class="form__group">
        <label class="form__label">描述</label>
        <input v-model="description" class="form__input" />
      </div>

      <!-- 備註 -->
      <div class="form__group">
        <label class="form__label">備註</label>
        <input v-model="remark" class="form__input" />
      </div>

      <!-- 原價 -->
      <div class="form__group">
        <label class="form__label">原價</label>
        <input type="number" v-model="originalPrice" class="form__input" />
      </div>

      <!-- 特價 -->
      <div class="form__group">
        <label class="form__label">特價</label>
        <input type="number" v-model="specialPrice" class="form__input" />
      </div>

      <!-- 主圖上傳 -->
      <!-- 主圖上傳 -->
      <div class="form__group">
        <label class="form__label">主圖</label>
        <input type="file" @change="handleImageUpload" />
        <img
          v-if="mainImageUrl"
          :src="getImageUrl(mainImageUrl)"
          class="form__preview"
        />
      </div>

      <!-- 圖集上傳 -->
      <div class="form__group">
        <label class="form__label">其他圖</label>
        <input type="file" multiple @change="handleGalleryUpload" />
        <div class="form__gallery-preview">
          <div
            v-for="(img, index) in galleryImages"
            :key="index"
            class="form__gallery-image"
          >
            <img :src="getImageUrl(img.url)" />
            <button
              type="button"
              class="form__remove-button"
              @click="removeGalleryImage(index)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- 商品內容 -->
      <div class="form__group">
        <label class="form__label">商品內容</label>
        <ckeditor
          :editor="editor"
          v-model="detailHtml"
          :config="editorConfig"
          class="custom-editor"
        >
        </ckeditor>
      </div>

      <!-- 是否啟用 -->
      <div class="form__group">
        <label class="form__label">啟用</label>
        <input type="checkbox" v-model="status" />
      </div>

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
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { object, string, number } from 'yup';
import {
  createProductDraft,
  editProduct,
  fetchProductDetail,
  uploadProductImage,
} from '@/services/admin/adminProductServices';
import { withLoading } from '@/utils/loadingUtils';
import { fetchCategoryList } from '@/services/admin/adminCategoryServices';
import { getImageUrl } from '@/utils/ImageUtils';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string | undefined;
const isEdit = !!id;

const productId = ref<number>();
const categoryOptions = ref<any[]>([]);
const mainImageUrl = ref('');
const schema = object({
  name: string().required('商品名稱為必填'),
  categoryId: string().required('分類為必選'),
});

const { handleSubmit, defineField, setValues, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    categoryId: '',
    subtitle: '',
    description: '',
    remark: '',
    originalPrice: 0,
    specialPrice: 0,
    mainImage: '',
    galleryImages: [],
    detailHtml: '',
    status: true,
  },
});

const [name] = defineField('name');
const [categoryId] = defineField('categoryId');
const [subtitle] = defineField('subtitle');
const [description] = defineField('description');
const [remark] = defineField('remark');
const [originalPrice] = defineField('originalPrice');
const [specialPrice] = defineField('specialPrice');
const [mainImage] = defineField('mainImage');
const [detailHtml] = defineField('detailHtml');
const [status] = defineField('status');

const [galleryImages] = defineField('galleryImages');

// 圖集圖片上傳
const handleGalleryUpload = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !productId.value) return;

  for (const file of files) {
    const res = await uploadProductImage({
      file,
      productId: productId.value,
      type: 'gallery',
    });
    if (res.success) {
      galleryImages.value.push({ url: res.data.url });
    }
  }
};

// 移除圖集圖片
const removeGalleryImage = (index: number) => {
  galleryImages.value.splice(index, 1);
};

const goBack = () => router.push('/admin/mall/items');

const handleImageUpload = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !productId.value) return;

  const res = await uploadProductImage({
    file,
    productId: productId.value,
    type: 'main',
  });

  if (res.success) {
    mainImage.value = res.data.url;
    mainImageUrl.value = res.data.url;
  }
};

const onSubmit = handleSubmit(async (formValues) => {
  if (!productId.value) return;

  await withLoading(() =>
    editProduct({
      productId: productId.value,
      ...formValues,
    })
  );

  goBack();
});

onMounted(async () => {
  // 載入分類選項
  try {
    const res = await fetchCategoryList();
    if (res.success && Array.isArray(res.data)) {
      categoryOptions.value = res.data;
    }
  } catch (error) {
    console.error('分類載入失敗', error);
  }

  if (isEdit && id) {
    const res = await fetchProductDetail(Number(id));
    if (res.success && res.data) {
      productId.value = res.data.id;
      setValues({
        name: res.data.name,
        categoryId: res.data.categoryId,
        subtitle: res.data.subtitle,
        description: res.data.description,
        remark: res.data.remark,
        originalPrice: res.data.originalPrice,
        specialPrice: res.data.specialPrice,
        mainImage: res.data.mainImageUrl,
        detailHtml: res.data.detailHtml,
        status: res.data.status,
        galleryImages: res.data.galleryImages ?? [],
      });
    }
  } else {
    const res = await createProductDraft();
    if (res.success) {
      productId.value = res.data.productId;
    }
  }
});

watch(mainImage, (val) => {
  console.log(val);

  mainImageUrl.value = val;
});

//
const editor = ClassicEditor as any;

// 自定義 CKEditor 配置，啟用圖片大小調整功能
const editorConfig = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    'blockQuote',
    'imageUpload',
    '|',
    'imageResize',
  ],
  language: 'zh-tw',
  image: {
    toolbar: ['imageStyle:full', 'imageStyle:side', 'imageResize'],
    resizeOptions: [
      { name: 'resizeImage:original', label: '原始大小', value: null },
      { name: 'resizeImage:50', label: '50%', value: '50' },
      { name: 'resizeImage:75', label: '75%', value: '75' },
    ],
    resizeUnit: '%' as '%' | 'px',
  },
  extraPlugins: [CustomUploadAdapterPlugin],
};

function CustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyCustomUploadAdapter(loader);
  };
}

class MyCustomUploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(async (file: File) => {
      try {
        const res = await withLoading(() =>
          uploadProductImage({
            file,
            productId: productId.value,
            type: 'description',
          })
        );

        if (res.success && res.data?.url) {
          const url = getImageUrl(res.data.url);
          return {
            default: url,
          };
        } else {
          console.error('圖片上傳失敗', res);
          throw new Error('圖片上傳失敗，請稍後再試');
        }
      } catch (err) {
        console.error('圖片上傳錯誤', err);
        throw err;
      }
    });
  }

  abort() {
    console.log('圖片上傳被中止');
  }
}
</script>

<style scoped lang="scss">
.form__preview {
  margin-top: 1rem;
  max-height: 120px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.form__gallery-preview {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  gap: 1rem;
}

.form__gallery-image {
  position: relative;
  width: 120px;
  height: 120px;
  border: 1px solid #ccc;
  border-radius: 6px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .form__remove-button {
    position: absolute;
    top: 2px;
    right: 2px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
