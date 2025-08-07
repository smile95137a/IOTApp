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
        <div
          class="news-card__image"
          :style="{ backgroundImage: `url(${news.image})` }"
        ></div>
        <div class="news-card__content">
          <div class="news-card__info">
            <div class="news-card__title">{{ news.title }}</div>
            <div class="news-card__desc">{{ news.summary }}</div>
            <div class="news-card__date">2024.9.16</div>
          </div>
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
  align-items: center;
  position: relative;

  &:hover {
    transform: translateY(-2px);
  }

  &__image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    background-size: cover;
    background-position: center;
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
    gap: 0.5rem; // 加一點間距更清楚
    overflow: hidden; // 限制內容不超出
  }

  &__info {
    flex: 1; // 讓資訊內容可收縮
    min-width: 0; // 避免內容撐開
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__arrow {
    color: #000;
    font-size: 1rem;
    flex-shrink: 0; // 固定箭頭大小
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
}
</style>
