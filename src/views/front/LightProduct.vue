<template>
  <div class="blessing-page">
    <SectionBackground variant="divination" />
    <div class="blessing-page__container">
      <Title color="white" text="點燈祈福" />
      <div class="blessing-page__header">
        <p class="blessing-page__description">
          請點選下列表的任一盞燈，即可看到該盞燈的介紹，並進行選購。
        </p>
      </div>

      <LightBlessingTabs />
      <template v-if="step === 1">
        <!-- 燈品列表 -->
        <div class="blessing-page__section">
          <Title color="dark" text="祈福燈產品" />
          <div class="blessing-page__grid">
            <div
              class="blessing-page__item"
              v-for="lamp in lamps"
              :key="lamp.id"
              @click="selectLamp(lamp)"
            >
              <img
                :src="imageMap[lamp.iconName]"
                :alt="lamp.name"
                class="blessing-page__item-image"
              />
            </div>
          </div>
        </div>
      </template>
      <MCard>
        <template v-if="step === 1">
          <LightSelectionStep />
        </template>
        <template v-if="step === 2">
          <BlessingInfoStep />
        </template>
      </MCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBlessingStore } from '@/stores/blessingStore';
import lightImages from '@/data/lightImages';
import LightSelectionStep from '@/views/front/LightSelectionStep.vue';
import BlessingInfoStep from '@/views/front/BlessingInfoStep.vue';
import { getLanternList } from '@/services/lanternServices';
import SectionBackground from '@/components/common/SectionBackground.vue';
import LightBlessingTabs from '@/components/front/LightBlessingTabs.vue';
import MCard from '@/components/common/MCard.vue';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { useRouter } from 'vue-router';
const router = useRouter();
const blessingStore = useBlessingStore();
const authStore = useAuthFrontStore();
const { step, selectedLamp, quantity, contactInfos } =
  storeToRefs(blessingStore);

const { setSelectedLamp, setQuantity, nextStep, updateContact } = blessingStore;

// 燈品列表
const lamps = ref<any[]>([]);

const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

const fetchLamps = async () => {
  try {
    const res = await getLanternList();
    if (res.success && res.data.length > 0) {
      lamps.value = res.data;
      const defaultLamp = lamps.value[0];
      setSelectedLamp(defaultLamp);
    } else {
      lamps.value = lightImages;
      setSelectedLamp(lamps.value[0]);
    }
  } catch (err) {
    lamps.value = lightImages;
    setSelectedLamp(lamps.value[0]);
  }
};

// 點選燈品
const selectLamp = (lamp: any) => {
  setSelectedLamp(lamp);
};

onMounted(() => {
  blessingStore.resetBlessing();
  fetchLamps();
  if (!authStore.isLogin) {
    router.replace({ name: 'Login' });
    return;
  }
});
</script>

<style scoped lang="scss">
.blessing-page {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  &__description {
    font-size: 1rem;
    color: #000;
    margin-top: 0.5rem;
    text-align: left;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 1rem;
    justify-items: center;
  }

  &__item {
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__item-image {
    width: 114px;
    height: 144px;
    background: white;
    object-fit: cover;
  }
}

/* MCard 包含的燈箱樣式 */
.lamp-box {
  background: #fff;
  border-radius: 10px;
  padding: 1.5rem;
  font-family: sans-serif;

  &__header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    object-fit: cover;
  }

  &__info {
    flex: 1;
    min-width: 200px;
  }

  &__title {
    font-size: 1.5rem;
    color: #a2352c;
    margin: 0;
  }

  &__desc {
    color: #d45343;
    font-weight: bold;
    margin-top: 0.25rem;
    text-decoration: underline;
    font-size: 0.95rem;
  }

  &__stat {
    text-align: right;
    font-size: 0.9rem;
    color: #333;
    min-width: 200px;
  }

  &__highlight {
    color: #d32f2f;
    font-weight: bold;
  }

  &__row {
    display: flex;
    gap: 1.5rem;
    background: #ffe5df;
    padding: 1rem;
    border-radius: 10px;
    flex-wrap: wrap;
  }

  &__column {
    flex: 1;
    min-width: 220px;
    margin-bottom: 1rem;
  }

  &__label {
    font-weight: bold;
    display: block;
    margin-bottom: 0.25rem;
  }

  /* 內建 input 與 textarea */
  &__input,
  &__textarea,
  &__select {
    width: 100%;
    padding: 0.4rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }

  &__textarea {
    resize: vertical;
    min-height: 80px;
  }

  &__select-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__reminder {
    padding: 0.75rem;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
  }

  &__actions {
    width: 100%;
    text-align: center;
    margin-top: 1rem;
  }

  &__submit {
    padding: 0.75rem 2rem;
    background: #a2352c;
    color: #fff;
    border: none;
    border-radius: 999px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      background: #892d24;
    }
  }
}

/* 燈資訊區塊 */
.lamp-info {
  margin-top: 2rem;

  &__block {
    margin-bottom: 1.5rem;
  }

  &__title {
    position: relative;
    &-text {
      background-color: #a2352c;
      color: white;
      font-weight: bold;
      padding: 0.5rem 1rem;
      font-size: 1.1rem;
      max-width: 392px;
    }
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #a2352c;
    }
  }

  &__content {
    text-align: left;
    padding: 1rem;
    line-height: 1.6;
    font-size: 1rem;
    color: #000;
  }
}
</style>
