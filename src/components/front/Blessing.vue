<template>
  <section class="blessing">
    <!-- 今日推薦 -->
    <div class="blessing__section">
      <h2 class="blessing__title">今日推薦</h2>
      <div class="blessing__list">
        <div class="blessing__card" v-for="item in todayList" :key="item.id">
          <img :src="item.image" alt="神燈圖示" class="blessing__image" />
          <div class="blessing__info">
            <div class="blessing__label">信女 {{ item.name }}</div>
            <p class="blessing__message">{{ item.message }}</p>
            <div class="blessing__date">於 {{ item.date }} 祈福</div>
            <div class="blessing__tags">{{ item.tags }}</div>
          </div>
          <button class="blessing__btn">
            請祝福我 <span class="blessing__btn-arrow">➤</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 本週人氣燈王 -->
    <div class="blessing__section">
      <h2 class="blessing__title">本週人氣燈王</h2>
      <div class="blessing__list">
        <div
          class="blessing__card blessing__card--ranked"
          v-for="(item, index) in weekList"
          :key="item.id"
        >
          <img :src="getBadge(index)" alt="徽章" class="blessing__badge" />
          <img :src="item.image" alt="神燈圖示" class="blessing__image" />
          <div class="blessing__info">
            <div class="blessing__label">信女 {{ item.name }}</div>
            <p class="blessing__message">{{ item.message }}</p>
            <div class="blessing__date">於 {{ item.date }} 祈福</div>
            <div class="blessing__tags">{{ item.tags }}</div>
          </div>
          <button class="blessing__btn">
            請祝福我 <span class="blessing__btn-arrow">➤</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const todayList = [
  {
    id: 1,
    name: '琪',
    message: '保佑我～收入越來越好，財運亨通，哞……',
    date: '2025-04-27',
    tags: '招 財 燈',
    image: new URL('@/assets/bless-1.png', import.meta.url).href,
  },
  {
    id: 2,
    name: '琪',
    message: '保佑我～收入越來越好，財運亨通，哞……',
    date: '2025-04-27',
    tags: '平 安 燈',
    image: new URL('@/assets/bless-2.png', import.meta.url).href,
  },
  {
    id: 3,
    name: '琪',
    message: '保佑我～收入越來越好，財運亨通，哞……',
    date: '2025-04-27',
    tags: '事 業 燈',
    image: new URL('@/assets/bless-3.png', import.meta.url).href,
  },
];

const weekList = [...todayList]; // 可替換成不同資料

const getBadge = (index) =>
  new URL(`@/assets/badge-${index + 1}.png`, import.meta.url).href;
</script>

<style scoped lang="scss">
.blessing {
  background-color: #c2aeaa;
  padding: 2rem 1rem;

  &__section {
    margin-bottom: 3rem;
  }

  &__title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  &__wave {
    width: 60px;
    height: auto;
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
  }

  &__card {
    background-color: #fff;
    border-radius: 16px;
    padding: 1rem;
    width: 300px;
    position: relative;
    text-align: left;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &__card--ranked {
    background-color: #ffeceb;
  }

  &__badge {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 48px;
  }

  &__image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: contain;
    margin-bottom: 0.5rem;
  }

  &__info {
    margin-bottom: 1rem;
  }

  &__label {
    font-weight: bold;
    color: #aa0033;
    font-size: 14px;
    margin-bottom: 0.25rem;
  }

  &__message {
    font-size: 13px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 0.25rem;
  }

  &__date {
    font-size: 12px;
    color: #666;
    margin-bottom: 0.25rem;
  }

  &__tags {
    font-size: 12px;
    color: #5f2e13;
    font-weight: bold;
  }

  &__btn {
    background-color: #532c10;
    color: #fff2a8;
    border: none;
    padding: 0.5rem 1rem;
    font-weight: bold;
    font-size: 14px;
    border-radius: 999px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
    width: 100%;
    transition: background 0.2s;

    &:hover {
      background-color: #6e3b16;
    }

    &-arrow {
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>
