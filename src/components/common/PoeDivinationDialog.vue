<template>
  <Dialog
    :isOpen="isOpen"
    :customClass="['dialog--poeDivinationDialog', customClass].join(' ')"
    @close="handleClose"
  >
    <div class="poeDivinationDialog">
      <SectionBackground variant="red" />
      <section class="divination">
        <!-- 說明文字 -->
        <p class="divination__instruction">
          虔誠向帝君奉香求籤，並擲筊請示帝君是否為此籤，若為聖筊則可觀看籤詩內容，若為笑筊或陰筊則需重新求籤。
        </p>

        <!-- 中央擲筊圖 -->
        <div class="divination__main-img" v-if="currentResult">
          <img :src="getCupImage(currentResult)" alt="bwa" />
        </div>

        <!-- 擲筊按鈕 -->
        <StartButton
          styleType="yellow"
          :label="isThrowing ? '擲筊中...' : '開始擲筊'"
          :disabled="isThrowing || results.length >= maxTries"
          @click="throwBwa"
        />

        <!-- 結果列表 -->
        <div class="divination__results" v-if="results.length > 0">
          <div
            v-for="(result, index) in results"
            :key="index"
            class="divination__result-block"
          >
            <p class="divination__result-label">第{{ index + 1 }}次擲杯</p>
            <p class="divination__result-text">
              {{ getResultLabel(result) }}
            </p>

            <img
              :src="getCupImage(result)"
              :alt="result"
              class="divination__result-img"
            />
          </div>
        </div>
      </section>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from './Dialog.vue';
import StartButton from '@/components/front/StartButton.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import bwaYin from '@/assets/image/bwa-yin.png';
import bwaXiao from '@/assets/image/bwa-xiao.png';
import bwaSheng from '@/assets/image/bwa-sheng.png';
import { ref, computed } from 'vue';
import { useDialogStore } from '@/stores/dialogStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { executeApi } from '@/utils/executeApiUtils';
import { addNormalPoe } from '@/services/poeService';

const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();
const isOpen = computed(() => dialogStore.isPoeDivinationDialogOpen);
const customClass = computed(() => dialogStore.customClass);

const handleClose = (resultFromAction?: any) => {
  const allSheng =
    results.value.length === maxTries &&
    results.value.every((r) => r === 'SHENG');
  dialogStore.closePoeDivinationDialog(resultFromAction ?? allSheng);
};

const results = ref<string[]>([]);
const currentResult = ref('');
const isThrowing = ref(false);
const maxTries = 3;

const throwBwa = async () => {
  if (isThrowing.value || results.value.length >= maxTries) return;
  if (results.value.length === 0 && authStore.isLogin) {
    await executeApi({
      fn: () => addNormalPoe({ count: 1 }),
    });
  }

  isThrowing.value = true;

  setTimeout(() => {
    const result = getRandomResult();
    currentResult.value = result;
    results.value.push(result);
    isThrowing.value = false;

    if (results.value.length === maxTries) {
      setTimeout(() => {
        const allSheng = results.value.every((r) => r === 'SHENG');
        handleClose(allSheng);
      }, 1000);
    }
  }, 300);
};

const getRandomResult = (): string => {
  const random = Math.floor(Math.random() * 100) + 1;
  if (random <= 5) return 'YIN';
  if (random <= 10) return 'XIAO';
  return 'SHENG';
};
const getResultLabel = (code: string): string => {
  if (code === 'YIN') return '陰筊';
  if (code === 'XIAO') return '笑筊';
  if (code === 'SHENG') return '聖筊';
  return code;
};

const getCupImage = (result: string) => {
  if (result === 'YIN') return bwaYin;
  if (result === 'XIAO') return bwaXiao;
  if (result === 'SHENG') return bwaSheng;
  return '';
};
</script>

<style scoped lang="scss">
.divination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 40px 20px;
  color: #fff;

  &__instruction {
    font-size: 16px;
    margin-bottom: 24px;
    line-height: 1.8;
    max-width: 480px;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
  }
  &__main-img {
    flex: 1;
    display: flex;
    align-items: center;

    justify-content: center;
  }
  &__main-img img {
    width: 120px;
    height: auto;
    margin-bottom: 24px;
  }

  &__results {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #fff;
    width: 100%;
  }

  &__result-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__result-label {
    font-size: 14px;
  }

  &__result-img {
    width: 40px;
    height: auto;
  }

  &__result-text {
    font-size: 22px;
    font-weight: bold;
  }

  &__reset {
    margin-top: 32px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
if (authStore.isLogin) { await executeApi({ fn: () => addPoeThrowTimes({ count:
1 }), }); } 幫我執行的時候打api
