<template>
  <section class="master">
    <SectionBackground variant="divination" />
    <div class="master__container">
      <Title color="dark" text="大師親算" />
      <div class="master__list">
        <div
          v-for="(masterItem, index) in masters"
          :key="masterItem.code"
          class="master__card"
        >
          <div class="master__header">
            <div class="master__header-left">
              <h3 class="master__name">{{ masterItem.name }}</h3>
              <p class="master__subtitle">{{ masterItem.title }}</p>
            </div>
            <button class="master__btn" @click="goToReservation(masterItem)">
              大師親算 <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <div class="master__content">
            <div class="master__left">
              <div class="master__desc">
                <p><strong>主星：</strong>{{ masterItem.mainStar }}</p>
                <p><strong>簡介：</strong>{{ masterItem.bio }}</p>
                <p><strong>學經歷：</strong>{{ masterItem.experience }}</p>
                <p><strong>隨身物品：</strong>{{ masterItem.personalItems }}</p>
              </div>
            </div>
            <div class="master__right">
              <img
                class="master__image"
                :src="getMasterImage(masterItem)"
                alt="大師照片"
              />
            </div>
          </div>

          <div class="master__topics">
            <div
              v-for="(item, idx) in masterItem.serviceItem"
              :key="idx"
              class="master__topic"
            >
              <div class="master__topic-header">
                <div class="master__topic-title">{{ item.title }}</div>
              </div>
              <div class="master__topic-desc">{{ item.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import { onMounted, ref } from 'vue';
import { useMasterOrderStore } from '@/stores/masterOrderStore';
import defaultImage from '@/assets/image/master.png';
import { fetchMasterList } from '@/services/masterServices';

const store = useMasterOrderStore();
const masters = ref([]);

const getMasterImage = (masterItem: any) => {
  return masterItem.imageBase64 ? `${masterItem.imageBase64}` : defaultImage;
};

const fetchData = async () => {
  try {
    const { success, data } = await fetchMasterList();
    if (success) {
      masters.value = data;
    }
  } catch (error) {
    console.error('fetchMasterList error:', error);
  }
};

onMounted(fetchData);

const goToReservation = (masterItem: any) => {
  store.selectMaster(masterItem);
  store.nextStep();
};
</script>

<style scoped lang="scss">
.master {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__card {
    background: #fff;
    border-radius: 20px;
    padding: 2rem;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__header-left {
    display: flex;
    flex-direction: column;
  }

  &__name {
    font-size: 1.8rem;
    color: #a53b25;
    font-weight: bold;
    margin-bottom: 0.25rem;
  }

  &__subtitle {
    color: #b85b5b;
    font-size: 1.05rem;
  }

  &__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #3d1f0f;
    color: #f7c56b;
    border: none;
    border-radius: 999px;
    padding: 0.4rem 1.25rem;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-left: auto; // 將按鈕推到右側

    i {
      font-size: 0.95rem;
    }

    &:hover {
      background-color: #2c150a;
    }

    @media (min-width: 1025px) {
      position: relative;
      right: 360px;
    }

    @media (max-width: 1024px) and (min-width: 769px) {
      position: relative;
      right: 280px;
    }

    @media (max-width: 768px) {
      margin-left: 0;
      position: static;
    }
  }

  &__content {
    display: flex;
    flex-wrap: wrap;
    background: #fdf0ee;
    padding: 2rem;
    border-radius: 12px;
    gap: 2rem;
    margin-bottom: 2.5rem;
    position: relative;
  }

  &__left {
    flex: 1 1 60%;
  }

  &__right {
    flex: 1 1 30%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  &__image {
    width: 296px;
    height: 444px;
    border-radius: 12px;
    object-fit: cover;
    margin-top: -80px;

    @media (max-width: 768px) {
      width: 100%;
      height: auto;
      max-width: 240px;
      margin-top: 0;
    }
  }

  &__desc {
    font-size: 0.95rem;
    color: #333;

    p {
      margin-bottom: 0.8rem;
      line-height: 1.6;
    }

    strong {
      color: #a53b25;
    }
  }

  &__topics {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__topic-header {
    position: relative;
    margin-bottom: 0.75rem;

    &::after {
      content: '';
      display: block;
      height: 1px;
      background-color: #a2352c;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

  &__topic-title {
    background-color: #a2352c;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    font-size: 1.1rem;
    display: inline-block;
    position: relative;
    z-index: 1;
    max-width: 392px;
  }

  &__topic-desc {
    text-align: left;
    padding: 1rem;
    font-size: 0.95rem;
    color: #000;
    line-height: 1.6;
    background-color: #fff;
    border-radius: 6px;
  }
}
</style>
