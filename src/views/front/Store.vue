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
  background: #00bfff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  min-height: 100px;

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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1rem;
    text-align: center;
    gap: 0.3rem;
    flex-shrink: 0;
    min-width: 80px;

    &--yellow {
      background: #ffc107;
      color: #000;
    }

    &--gray {
      background: #ddd;
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
    }

    .arrow {
      display: flex;
      align-items: center;
      font-size: 0.75rem;
      font-weight: bold;

      &::after {
        content: ' 查看';
        margin-left: 0.25rem;
      }
    }
  }
}
</style>
