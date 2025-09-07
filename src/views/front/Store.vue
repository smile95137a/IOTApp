<template>
  <div class="store-page">
    <div class="store-page__container">
      <div
        class="store-card"
        v-for="store in storeList"
        :key="store.uid"
        @click="goToDetail(store.uid)"
      >
        <img
          class="store-card__image"
          :src="getImageUrl(store.imgUrl)"
          :alt="store.name"
        />

        <div class="store-card__info">
          <div class="store-card__name">{{ store.name }}</div>
          <div class="store-card__address">{{ store.address }}</div>
        </div>

        <div
          class="store-card__table-count"
          :class="{
            'store-card__table-count--gray': store.availableCount === 0,
            'store-card__table-count--yellow': store.availableCount > 0,
          }"
        >
          <div class="label">剩餘桌數</div>
          <div class="count">{{ store.availableCount }}</div>
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
    fn: fetchAllStores,
    onSuccess: (data) => {
      const withAvailable = data.map((store: any) => {
        const availableCount =
          store.poolTables?.filter((t: any) => !t.isUse)?.length || 0;
        return { ...store, availableCount };
      });
      storeList.value = withAvailable;
    },
  });
};

const goToDetail = (uid: string) => {
  router.push({ name: 'StoreDetail', params: { id: uid } });
};

onMounted(loadStores);
</script>
<style scoped lang="scss">
.store-page {
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
  align-items: stretch;
  background: linear-gradient(135deg, #00bfff, #009acd); // 原藍色 → 藍色漸層
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  min-height: 100px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
  }

  &__image {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    margin: auto 1rem;
    background: #f5f5f5;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
    text-align: center;
    gap: 0.3rem;
    flex-shrink: 0;
    min-width: 80px;
    transition: background 0.3s ease;

    &--yellow {
      background: linear-gradient(90deg, #ffc107, #ffeb3b);
      color: #000;

      .count {
        animation: glowPulse 2s infinite;
      }
    }

    &--gray {
      background: linear-gradient(90deg, #ddd, #bbb);
      color: #666;
    }

    .label {
      font-size: 0.7rem;
      font-weight: 500;
    }

    .count {
      font-size: 1.5rem;
      font-weight: bold;
      line-height: 1;
      transition: transform 0.2s ease;
    }

    .arrow {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: bold;
      transition: transform 0.3s ease;

      &::after {
        content: ' 查看';
        margin-left: 0.25rem;
      }
    }
  }

  &:hover .store-card__table-count .arrow {
    transform: translateX(4px);
  }
}

/* ====== 動畫效果 ====== */
@keyframes glowPulse {
  0% {
    text-shadow: 0 0 4px rgba(255, 193, 7, 0.5);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 10px rgba(255, 193, 7, 0.9);
    transform: scale(1.1);
  }
  100% {
    text-shadow: 0 0 4px rgba(255, 193, 7, 0.5);
    transform: scale(1);
  }
}
</style>
