<template>
  <div class="divination-confirm">
    <SectionBackground variant="divination" />
    <div class="divination-confirm__container">
      <div class="divination-confirm__card">
        <SectionBackground variant="red" />
        <div class="divination-confirm__content">
          <!-- 左側：文字與按鈕 -->
          <div class="divination-confirm__left">
            <p class="divination-confirm__text">
              虔誠向帝君奉香求籤，並擲筊請示帝君是否為此籤，若為聖筊則可觀看籤詩內容，若為笑筊或陰筊則需重新求籤。
            </p>

            <div class="divination-confirm__button-wrapper">
              <StartButton
                styleType="yellow"
                label="開始求籤"
                @click="startDivination"
              />
            </div>
          </div>

          <!-- 右側：筊杯圖 -->
          <div class="divination-confirm__right">
            <div class="divination-confirm__cups">
              <img :src="cup" alt="cup" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import cup from '@/assets/image/cup.png';
import SectionBackground from '@/components/common/SectionBackground.vue';
import StartButton from '@/components/front/StartButton.vue';

import { useDivinationStepStore } from '@/stores/divinationStepStore';
import { useDialogStore } from '@/stores/dialogStore';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import { addSiunnPoe } from '@/services/poeService';
import { executeApi } from '@/utils/executeApiUtils';

const stepStore = useDivinationStepStore();
const { nextStep } = stepStore;
const dialogStore = useDialogStore();
const authStore = useAuthFrontStore();
const startDivination = async () => {
  const result = await dialogStore.openPoeDivinationDialog();

  if (result) {
    if (authStore.isLogin) {
      await executeApi({
        fn: () => addSiunnPoe({ count: 1 }),
      });
    }

    nextStep();
  } else {
    await dialogStore.openInfoDialog({
      title: '請示未果',
      message: '此次未得聖筊，請誠心再次請示帝君。',
    });
  }
};
</script>

<style lang="scss" scoped>
.divination-confirm {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  &__card {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    width: 100%;
    padding: 3rem 2rem;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  &__left {
    flex: 1 1 60%;
  }

  &__right {
    flex: 1 1 35%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__text {
    color: white;
    font-size: 1.1rem;
    line-height: 2;
    margin-bottom: 2.5rem;
    font-family: 'Noto Serif TC', serif;
  }

  &__button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  &__cups {
    img {
      width: 182px;
      height: 205px;
      object-fit: cover;
    }
  }
}
</style>
