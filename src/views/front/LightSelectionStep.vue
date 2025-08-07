<template>
  <!-- Step 1：選擇燈數 -->
  <div class="lamp-box">
    <div class="lamp-box__header">
      <img
        :src="imageMap[store.selectedLamp?.iconName]"
        :alt="store.selectedLamp?.name"
        class="lamp-box__image"
      />
      <div class="lamp-box__info">
        <div class="lamp-box__title">{{ store.selectedLamp?.name }}</div>
        <p class="lamp-box__desc">
          安奉 {{ store.selectedLamp?.name }}，{{
            store.selectedLamp?.subtitle
          }}
        </p>
      </div>
      <div class="lamp-box__stat">
        <p>
          目前有
          <span class="lamp-box__highlight">22753</span> 盞
        </p>
        <p>{{ store.selectedLamp?.labelRight }}</p>
      </div>
    </div>

    <div class="lamp-box__row">
      <div class="lamp-box__column">
        <!-- 點燈費用 -->
        <label class="lamp-box__label">點燈費用：</label>
        <div v-if="priceOptions.length" class="lamp-box__price-list">
          <label
            v-for="item in priceOptions"
            :key="item.month"
            class="lamp-box__price-option"
          >
            <input type="radio" :value="item" v-model="store.selectedPrice" />
            {{ item.month === 12 ? '1年期' : `${item.month}個月` }} NT${{
              item.price
            }}元
          </label>
        </div>
        <div v-else>尚無價格資訊</div>
      </div>

      <div class="lamp-box__column">
        <label class="lamp-box__label">您要選購的燈數：</label>
        <div class="lamp-box__select-wrapper">
          <select
            v-model="store.quantity"
            class="lamp-box__select"
            @change="store.setQuantity(store.quantity)"
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
          <span>盞</span>
        </div>
      </div>

      <div class="lamp-box__column lamp-box__column--wide">
        <label class="lamp-box__label">貼心提醒：</label>
        <p class="lamp-box__reminder">
          除了幫自己點燈，也別忘了幫親友一起點燈祈福唷！<br />
          每次系統正規購買的數量上限為10盞燈，若想超過分次依序點，謝謝。
        </p>
      </div>

      <div class="lamp-box__actions">
        <button class="lamp-box__submit" @click="handleNext">下一步</button>
      </div>
    </div>
  </div>

  <!-- 燈資訊說明 -->
  <div class="lamp-info">
    <div
      class="lamp-info__block"
      v-for="section in parsedSections"
      :key="section.title"
    >
      <div class="lamp-info__title">
        <div class="lamp-info__title-text">{{ section.title }}</div>
      </div>
      <div class="lamp-info__content">{{ section.content }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import lightImages from '@/data/lightImages';
import { useBlessingStore } from '@/stores/blessingStore';
import { useDialogStore } from '@/stores/dialogStore';
import { watch } from 'vue';

const dialogStore = useDialogStore();
const store = useBlessingStore();
const priceOptions = computed(() => {
  try {
    const list = store.selectedLamp?.priceListJson?.trim();
    return list ? JSON.parse(list) : [];
  } catch (err) {
    console.warn('解析 priceListJson 失敗', err);
    return [];
  }
});
const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

// 點擊下一步
const handleNext = async () => {
  if (!store.selectedPrice) {
    await dialogStore.openInfoDialog({
      title: '請選擇點燈期間',
      message: '請先選擇一個點燈費用方案才能繼續。',
    });
    return;
  }

  if (!store.quantity || store.quantity <= 0) {
    await dialogStore.openInfoDialog({
      title: '請選擇燈數',
      message: '請至少選擇 1 盞燈才能繼續。',
    });
    return;
  }

  store.setQuantity(store.quantity);
  store.nextStep();
};

const parsedSections = computed(() => {
  try {
    return store.selectedLamp?.qaJson
      ? JSON.parse(store.selectedLamp.qaJson)
      : [];
  } catch (e) {
    console.warn('解析 qaJson 失敗：', e);
    return [];
  }
});
watch(
  () => store.selectedLamp?.id, // 或其他唯一值
  () => {
    store.selectedPrice = null;
  }
);
</script>

<style scoped lang="scss">
/* Blessing page 與燈品列表區塊樣式 */
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
.lamp-box__price-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.lamp-box__price-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #ffe5df;
  }

  input {
    cursor: pointer;
  }
}
</style>
