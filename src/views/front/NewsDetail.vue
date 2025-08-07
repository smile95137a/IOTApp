<template>
  <div class="news-page">
    <h1 class="news-page__title">最新消息</h1>

    <div class="news-page__list">
      <div
        class="news-card"
        v-for="news in newsList"
        :key="news.id"
        @click="goToDetail(news.id)"
      >
        <img class="news-card__image" :src="news.image" alt="news" />
        <div class="news-card__content">
          <div class="news-card__title">{{ news.title }}</div>
          <div class="news-card__desc">{{ news.summary }}</div>
          <div class="news-card__arrow">
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const newsList = [
  {
    id: 1,
    title: '板橋文化振興店開幕大放送',
    summary: '內容內容內容內容內容內容內容內容內容內容內容內容內容內容...',
    image: '/news-thumb.jpg',
  },
  {
    id: 2,
    title: '台北中山旗艦館開張囉！',
    summary: '內容內容內容內容內容內容內容內容內容內容內容內容內容內容...',
    image: '/news-thumb.jpg',
  },
  {
    id: 3,
    title: '享撞球 x 特約優惠活動開跑',
    summary: '內容內容內容內容內容內容內容內容內容內容內容內容內容內容...',
    image: '/news-thumb.jpg',
  },
];

const goToDetail = (id: number) => {
  router.push({ name: 'NewsDetail', params: { id } });
};
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
}

.news-card {
  display: flex;
  flex-direction: row;
  background: #00bfff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  &__image {
    width: 100px;
    height: 100px;
    object-fit: cover;

    @media (min-width: 768px) {
      width: 120px;
      height: 120px;
    }
  }

  &__content {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  &__title {
    font-weight: bold;
    font-size: 1rem;
    margin-bottom: 0.25rem;
    color: #000;
  }

  &__desc {
    font-size: 0.85rem;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__arrow {
    position: absolute;
    right: 1rem;
    top: 1.25rem;
    font-size: 1rem;
    color: #000;
  }
}
</style>
