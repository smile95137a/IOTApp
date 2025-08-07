<template>
  <section class="ranking">
    <SectionBackground variant="red" />
    <div class="ranking__container">
      <!-- 左側排行榜 -->
      <div class="ranking__left">
        <Title :text="`擲筊排行榜`" color="white" />
        <div class="ranking__table">
          <div class="ranking__header">
            <span>善男／信女</span>
            <span>聖筊數</span>
          </div>

          <div
            v-for="(item, index) in topRankings"
            :key="index"
            class="ranking__row"
          >
            <div class="ranking__rank">
              <img
                v-if="index < 3"
                :src="getMedalIcon(index)"
                class="ranking__medal"
                :alt="`rank-${index + 1}`"
              />
              <div v-else class="ranking__rank-index">{{ index + 1 }}</div>
            </div>
            <div class="ranking__content">
              <div class="ranking__name">{{ maskName(item.name) }}</div>
              <div class="ranking__score">{{ item.score }}</div>
            </div>
          </div>
        </div>
        <StartButton styleType="yellow" label="查看完整排名" />
      </div>

      <!-- 右側圖片預留區 -->
      <div class="ranking__right">
        <div class="ranking__image-placeholder"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import r1 from '@/assets/image/r1.png';
import r2 from '@/assets/image/r2.png';
import r3 from '@/assets/image/r3.png';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import StartButton from '@/components/front/StartButton.vue';
import { getPoeRank } from '@/services/poeService';
import { withLoading } from '@/utils/loadingUtils';
import { onMounted, ref } from 'vue';

// 替換原本 topRankings 為 API 資料
const topRankings = ref<any[]>([]);

onMounted(async () => {
  try {
    const res = await withLoading(() => getPoeRank({ count: 10 }));
    if (res.success) {
      topRankings.value = res.data;
    }
  } catch (e) {
    console.error('排行榜載入失敗', e);
  }
});

const maskName = (name: string) => {
  if (name.length <= 2) return name[0] + '*';
  return name[0] + '*' + name.slice(2);
};

const getMedalIcon = (index: number) => {
  return {
    0: r1,
    1: r2,
    2: r3,
  }[index];
};
</script>

<style lang="scss" scoped>
.ranking {
  width: 100%;
  position: relative;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
    display: flex;
    gap: 4rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__left {
    flex: 1;
  }

  &__right {
    flex: 1.5;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__logo {
    width: 80px;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #fff; // ← 白色標題
  }

  &__header {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 1rem;
    margin-bottom: 1rem;
    color: #fff; // ← 白色表頭文字
  }

  &__table {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  &__row {
    display: flex;
    align-items: flex-start;
  }

  &__rank {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__medal {
    width: 40px;
    height: auto;
  }

  &__rank-index {
    width: 32px;
    height: 32px;
    background: #ffffff33;
    border-radius: 50%;
    text-align: center;
    line-height: 32px;
    font-weight: bold;
    color: #fff;
  }

  &__content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 0.75rem;
  }

  &__name {
    font-size: 1rem;
    font-weight: 500;
    color: #fff; // ← 白色名字
  }

  &__score {
    font-size: 1rem;
    font-weight: bold;
    min-width: 48px;
    text-align: right;
    color: #fff; // ← 白色數字
  }

  &__btn {
    margin-top: 2rem;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }

  &__btn-text {
    color: #ffdb6f;
    font-weight: bold;
    font-size: 1rem;
    border-bottom: 2px solid #ffdb6f;
  }

  &__btn-icon {
    width: 48px;
    height: auto;
  }

  &__image-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    background-color: #f2f2f2;
    border: 2px dashed #ccc;
    position: relative;

    &::before {
      content: '';
      display: block;
      position: absolute;
      inset: 0;
      background: linear-gradient(
          45deg,
          transparent 49%,
          #ccc 49%,
          #ccc 51%,
          transparent 51%
        ),
        linear-gradient(
          -45deg,
          transparent 49%,
          #ccc 49%,
          #ccc 51%,
          transparent 51%
        );
      background-size: 100% 100%;
    }
  }
}
</style>
