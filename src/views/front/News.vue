<template>
  <div class="news-page">
    <h1 class="news-page__title">最新消息</h1>

    <div class="news-page__list">
      <div
        v-if="newsList.length > 0"
        class="news-card"
        v-for="news in newsList"
        :key="news.newsUid"
        @click="goToDetail(news.newsUid)"
      >
        <img
          class="news-card__image"
          :src="getImageUrl(news.imageUrl)"
          :alt="news.title"
        />
        <div class="news-card__content">
          <div class="news-card__info">
            <div class="news-card__title">{{ news.title }}</div>
            <div class="news-card__desc">{{ getSummary(news.content) }}</div>
            <div class="news-card__date">
              {{ formatDate(news.createdDate) }}
            </div>
          </div>
          <div class="news-card__arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <div v-else class="news-page__empty">目前尚無最新消息</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllNewsNoUser } from '@/services/newsService';
import { getImageUrl } from '@/utils/ImageUtils';

const router = useRouter();
const newsList = ref<any[]>([]);

const fetchNews = async () => {
  try {
    const res = await getAllNewsNoUser();
    if (res.success) {
      newsList.value = res.data;
    } else {
      console.warn('取得最新消息失敗', res.message);
    }
  } catch (error) {
    console.error('無法載入最新消息', error);
  }
};

const goToDetail = (uid: string) => {
  router.push({ name: 'NewsDetail', params: { id: uid } });
};

const getSummary = (content: string, maxLength = 40) => {
  return content.length > maxLength
    ? content.slice(0, maxLength) + '...'
    : content;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr.replace(/-/g, '/'));
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
};

onMounted(fetchNews);
</script>

<style scoped lang="scss">
.news-page {
  padding: 2rem 1rem;
  background: linear-gradient(180deg, #1d1640 0%, #4067a4 99%);
  color: white;
  min-height: 100vh;

  &__title {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      max-width: 900px;
      margin: 0 auto;
    }
  }

  &__empty {
    text-align: center;
    font-size: 1rem;
    padding: 2rem;
    color: #fff;
  }
}

.news-card {
  display: flex;
  flex-direction: row;
  background: #00bfff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
  }

  &__image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    margin: 0.75rem;

    @media (min-width: 768px) {
      width: 120px;
      height: 120px;
    }
  }

  &__content {
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 1rem;
    background-color: #00bfff;
    border-radius: 0 12px 12px 0;
    gap: 0.5rem;
    overflow: hidden;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__title {
    font-weight: bold;
    font-size: 1rem;
    color: #000;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__desc {
    font-size: 0.85rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__date {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #008bff;
  }

  &__arrow {
    color: #000;
    font-size: 1rem;
    flex-shrink: 0;
  }
}
</style>
