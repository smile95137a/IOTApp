<template>
  <section class="light-blessing" v-if="lightList.length > 0">
    <SectionBackground variant="light" />
    <div class="light-blessing__container">
      <Title color="dark" text="推薦點燈" />

      <div class="light-blessing__list">
        <div
          v-for="(item, index) in lightList"
          :key="item.name + item.createTime + index"
          class="light-blessing__card"
        >
          <img
            :src="imageMap[item.lanternCode]"
            class="light-blessing__image"
          />
          <div class="light-blessing__content">
            <div class="light-blessing__type">信眾 {{ item.name }}</div>
            <p class="light-blessing__desc">{{ item.message }}</p>
            <div class="light-blessing__date">
              於
              <DateFormatter
                :date="item.createTime"
                :format="'YYYY/MM/DD HH:mm:ss'"
              />

              點燈
            </div>
          </div>
          <button class="light-blessing__btn" @click="goToLightProduct">
            請祝福我 <i class="fas fa-chevron-right"></i>
          </button>
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
import DateFormatter from '../common/DateFormatter.vue';
import { getRecommendationLanterns } from '@/services/lanternServices';
import { useRouter } from 'vue-router';

const lightList = ref<any[]>([]);
const router = useRouter();

const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

const goToLightProduct = () => {
  router.push('/lightProduct');
};

// 初始化 API
onMounted(async () => {
  try {
    const res = await getRecommendationLanterns({ count: 3 });
    if (res.success) {
      lightList.value = res.data;
    }
  } catch (error) {
    console.error('getRecommendationLanterns error:', error);
  }
});
</script>

<style scoped lang="scss">
.light-blessing {
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
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    max-width: 390px;
    min-height: 196px;
    border: 1px solid #3c2313;
    background-color: #fff;
    border-radius: 30px;
    padding: 1rem;
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
    color: #a53b25;
    margin-bottom: 0.3rem;
  }

  &__desc {
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__date {
  }

  &__btn {
    width: 100%;
    max-width: 180px;
    height: 44px;

    position: absolute;
    bottom: -22px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #5b2d1b;
    color: #ffcc3e;
    font-weight: bold;
    font-size: 14px;
    padding: 0.4rem 1.2rem;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #3e1f13;
    }
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
