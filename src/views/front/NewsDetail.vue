<template>
  <div class="news-detail">
    <div class="news-detail__container">
      <h1 class="news-detail__title">{{ detail?.title }}</h1>
      <p class="news-detail__date">
        <DateFormatter :date="detail?.createdDate" :format="'YYYY.MM.DD'" />
      </p>
      <img
        v-if="detail?.imageUrl"
        :src="getImageUrl(detail.imageUrl)"
        class="news-detail__image"
        :alt="detail?.title"
      />
      <div
        class="news-detail__content"
        v-html="formatContent(detail?.content)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getNewsByIdNoUser } from '@/services/newsService';
import { getImageUrl } from '@/utils/ImageUtils';
import DateFormatter from '@/components/common/DateFormatter.vue';
const route = useRoute();
const detail = ref<any>(null);

const fetchDetail = async () => {
  const id = route.params.id as string;
  try {
    const res = await getNewsByIdNoUser(id);
    if (res.success) {
      detail.value = res.data;
    }
  } catch (error) {
    console.error('取得新聞詳情失敗', error);
  }
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(/-/g, '/'));
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

const formatContent = (text?: string) => {
  return text?.replace(/\n/g, '<br/>') ?? '';
};

onMounted(fetchDetail);
</script>

<style scoped lang="scss">
.news-detail {
  color: #01befe;
  min-height: 100vh;
  padding: 2rem 1rem;

  &__container {
    max-width: 900px;
    margin: 0 auto;
    background-color: transparent;
    text-align: center;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    text-align: left;
    margin-bottom: 0.25rem;
    letter-spacing: 0.05em;

    @media (min-width: 768px) {
      font-size: 2rem;
    }
  }

  &__date {
    text-align: left;
    font-size: 0.85rem;
    color: #f67943;
    margin-bottom: 1.5rem;
    letter-spacing: 0.05em;
  }

  &__image {
    max-width: 100%;
    height: auto;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  &__content {
    text-align: left;
    line-height: 1.6;
    font-size: 1rem;
    white-space: pre-wrap;

    @media (min-width: 768px) {
      font-size: 1.05rem;
    }
  }
}
</style>
