<template>
  <div class="store-page">
    <div class="store-page__container">
      <div
        class="store-card"
        v-for="store in storeList"
        :key="store.id"
        @click="goToDetail(store.id)"
      >
        <img
          class="store-card__image"
          :src="getImageUrl(store.image)"
          :alt="store.name"
        />

        <div class="store-card__info">
          <div class="store-card__name">{{ store.name }}</div>
          <div class="store-card__address">{{ store.address }}</div>
          <div class="store-card__distance">{{ store.distance }}km</div>
        </div>

        <div class="store-card__table-count">
          <div class="label">剩餘桌數</div>
          <div class="count">{{ store.availableTables }}</div>
          <div class="arrow">
            <i class="fas fa-chevron-right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/ImageUtils';
import { fetchAllStores } from '@/services/storeService';
import type { Store } from '@/services/storeService';
import { executeApi } from '@/utils/executeApiUtils';

const router = useRouter();
const storeList = ref<Store[]>([]);

const loadStores = async () => {
  await executeApi({
    fn: () => fetchAllStores(),
    onSuccess: (data) => {
      storeList.value = data;
    },
  });
};

const goToDetail = (id: number | string) => {
  router.push({ name: 'StoreDetail', params: { id } });
};

onMounted(loadStores);
</script>

<style scoped lang="scss">
.store-page {
  background: linear-gradient(180deg, #1d1640 0%, #4067a4 99%);
  min-height: 100vh;
  padding: 2rem 1rem;

  &__container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.store-card {
  display: flex;
  align-items: stretch; // ⭐ 保證所有內容高度一致
  background: #00bfff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  min-height: 100px; // ⭐ 明確卡片高度

  &:hover {
    transform: translateY(-2px);
  }

  &__image {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    margin: auto 1rem;

    @media (min-width: 768px) {
      width: 70px;
      height: 70px;
    }
  }

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 0.5rem 0;

    & > * {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__name {
    font-weight: bold;
    font-size: 1rem;
    color: #000;
  }

  &__address {
    font-size: 0.85rem;
    color: #222;
    margin-top: 0.2rem;
  }

  &__distance {
    font-size: 0.8rem;
    color: #444;
    margin-top: 0.2rem;
  }

  &__table-count {
    background: #ffc107;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
    text-align: center;
    gap: 0.3rem;
    flex-shrink: 0;
    min-width: 80px;

    .label {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .count {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
    }

    .arrow {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: bold;
      color: #000;

      &::after {
        content: ' 查看';
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
