<template>
  <section class="light-scene" v-if="lightList.length > 0">
    <SectionBackground variant="red" />
    <div class="light-scene__container">
      <Title color="white" text="最新燈場" />

      <div class="light-scene__list">
        <div class="light-scene__card" v-for="item in lightList" :key="item.id">
          <img
            :src="imageMap[item.lanternCode]"
            alt="light image"
            class="light-scene__image"
          />

          <div class="light-scene__info">
            <div class="light-scene__type">信眾 {{ item.name }}</div>
            <p class="light-scene__desc">{{ item.message }}</p>
            <div class="light-scene__date">
              於
              <DateFormatter
                :date="item.createTime"
                :format="'YYYY/MM/DD HH:mm:ss'"
              />
              點燈
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Title from '@/components/common/Title.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import lightImages from '@/data/lightImages';
import { getLatestLanterns } from '@/services/lanternServices';
import DateFormatter from '../common/DateFormatter.vue';

const lightList = ref<any[]>([]);

const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

// 載入 API 資料
onMounted(async () => {
  try {
    const res = await getLatestLanterns({ count: 3 });
    if (res.success) {
      lightList.value = res.data;
    } else {
      console.warn('getLatestLanterns failed:', res.message);
    }
  } catch (error) {
    console.error('getLatestLanterns error:', error);
  }
});
</script>

<style scoped lang="scss">
.light-scene {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    justify-content: center;
  }

  &__card {
    display: flex;
    flex-direction: row;
    align-items: center; // 🔸左右欄垂直置中
    width: 100%;
    max-width: 390px;
    min-height: 196px;
    border: 1px solid #eeafa2;
    border-radius: 30px;
    padding: 1rem;
    color: #fff;
    gap: 1.2rem;
    transition: transform 0.3s ease;
    margin: 0 auto;

    &:hover {
      transform: translateY(-4px);
    }
  }

  &__image {
    width: 113px;
    height: 142px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-width: 0;
    word-wrap: break-word;
    font-size: 16px;
  }

  &__name {
    font-weight: bold;
    margin-bottom: 0.3rem;
  }

  &__type {
    color: #ffbf45;
    margin-bottom: 0.3rem;
  }

  &__desc {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__date {
    color: #ffb0a0;
  }

  @media (max-width: 768px) {
    &__card {
      flex-direction: row-reverse;
      align-items: center;
      text-align: left;
    }

    &__info {
      align-items: flex-start;
    }

    &__image {
      width: 90px;
      height: auto;
      margin-bottom: 0;
      margin-left: 1rem;
    }
  }
}
</style>
