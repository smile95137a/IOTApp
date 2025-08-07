<template>
  <div class="divination-result">
    <SectionBackground variant="divination" />
    <div class="divination-result__container">
      <div class="divination-result__layout">
        <!-- 左側紅色卡片 -->
        <div class="divination-result__card">
          <h2 class="divination-result__title">求籤問事</h2>

          <h3 class="divination-result__poem-title">
            {{ sequence }}（{{ zodiac }}）{{ title }}
          </h3>
          <p class="divination-result__label">【吉凶】{{ fortune }}</p>
          <p class="divination-result__label">【詩曰】</p>
          <p class="divination-result__paragraph">{{ poemText }}</p>

          <p class="divination-result__label">【解曰】</p>
          <p class="divination-result__paragraph">{{ explanation }}</p>

          <p class="divination-result__label">【先機】</p>
          <p class="divination-result__paragraph">{{ meaning }}</p>

          <p class="divination-result__label">【東坡解】</p>
          <p class="divination-result__paragraph">{{ dongponote }}</p>

          <p class="divination-result__label">【碧仙註】</p>
          <p class="divination-result__paragraph">{{ bixiannote }}</p>
        </div>

        <!-- 右側籤卡獨立 -->
        <div class="divination-result__poem-image">
          <div class="divination">
            <img :src="poemBg" class="divination__bg" />
            <div class="divination__container">
              <div class="divination__content">
                <!-- 左側 -->
                <div class="divination__left highlight-text">
                  <div class="divination__left-header">
                    <div class="vertical">先機</div>
                    <div class="vertical">解曰</div>
                  </div>
                  <div class="divination__left-content">
                    <div class="vertical" v-html="meaning" />
                    <div class="vertical" v-html="explanation" />
                  </div>
                </div>

                <!-- 右側 -->
                <div class="divination__right">
                  <div class="divination__right-poem">
                    <div
                      class="vertical"
                      v-for="(linePair, idx) in groupedPoem"
                      :key="`poem-${idx}`"
                    >
                      {{ linePair }}
                    </div>
                  </div>
                  <div class="divination__right-title highlight-text">
                    <div class="vertical">
                      {{ sequence }} {{ zodiac }} {{ title }} {{ fortune }}籤
                    </div>
                  </div>
                </div>
              </div>

              <div class="divination__footer">
                <div class="divination__note">
                  〔籤語〕
                  <div v-for="(line, idx) in groupedDongpo" :key="idx">
                    {{ line }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部祈福按鈕 -->
      <div class="divination-result__footer">
        <StartButton
          styleType="red"
          label="消災解厄，點燈祈福"
          @click="handleBlessing"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import poemBg from '@/assets/image/poem-bg.png';
import StartButton from '@/components/front/StartButton.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import { getRandomPoem } from '@/services/poemServices';
import { withLoading } from '@/utils/loadingUtils';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const sequence = ref('');
const title = ref('');
const zodiac = ref('');
const fortune = ref('');
const poemText = ref('');
const meaning = ref('');
const dongponote = ref('');
const bixiannote = ref('');
const explanation = ref('');

const groupedPoem = computed(() => {
  const lines = poemText.value.split(/[，,。]/).filter(Boolean);
  const result: string[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    result.push(`${lines[i]}　${lines[i + 1] ?? ''}`);
  }
  return result;
});
const splitByPunctuation = (text: string) =>
  text.split(/[，,。；、\s]/).filter((s) => !!s && s.trim() !== '');

const groupByN = (arr: string[], n: number): string[] => {
  const result: string[] = [];
  for (let i = 0; i < arr.length; i += n) {
    result.push(arr.slice(i, i + n).join('　'));
  }
  return result;
};

const groupedDongpo = computed(() =>
  groupByN(splitByPunctuation(dongponote.value), 4)
);

onMounted(async () => {
  try {
    const { success, data, message } = await withLoading(() => getRandomPoem());
    if (success) {
      const {
        sequence: s,
        title: t,
        zodiac: z,
        fortune: f,
        poem,
        meaning: m,
        dongponote: dp,
        bixiannote: bx,
        explanation: e,
      } = data;

      sequence.value = s;
      title.value = t;
      zodiac.value = z;
      fortune.value = f;
      poemText.value = poem;
      meaning.value = m;
      dongponote.value = dp;
      bixiannote.value = bx;
      explanation.value = e;
    } else {
      console.error('抽詩籤失敗', message);
    }
  } catch (err) {
    console.error('抽詩籤錯誤', err);
  }
});

const handleBlessing = () => {
  router.push('/blessing');
};
</script>

<style lang="scss" scoped>
.divination-result {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__layout {
    display: flex;
    justify-content: space-between;
    gap: 2rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  &__card {
    flex: 1 1 60%;
    background: linear-gradient(41.51deg, #e0664d 24.05%, #a53b25 60.53%);
    border-radius: 20px;
    padding: 2rem;
    color: white;
    font-family: 'Noto Serif TC', serif;
  }

  &__title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  &__poem-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  &__label {
    font-weight: bold;
    margin-top: 1.2rem;
    margin-bottom: 0.3rem;
  }

  &__paragraph {
    font-size: 1rem;
    line-height: 1.8;
  }

  &__poem-image {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 1rem;

    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }

  &__footer {
    text-align: center;
    margin-top: 2rem;
  }

  &__blessing-button {
    background: none;
    border: none;
    color: #a52f2f;
    font-weight: bold;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 1rem 2rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    border-top: 1px solid #a52f2f;
    border-bottom: 1px solid #a52f2f;
    font-family: 'Noto Sans TC', sans-serif;
  }

  &__blessing-icon {
    background-size: contain;
    background-repeat: no-repeat;
    width: 28px;
    height: 24px;
  }
}
.divination {
  display: flex;
  justify-content: center;
  padding: 18px;
  position: relative;

  min-width: 260px;
  min-height: 500px;
  &__bg {
    position: absolute;
    inset: 0;
    height: 100% !important;
  }

  &__container {
    position: relative;
    z-index: 2;
    width: 100%;
    border: 2px solid #a53b25;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Noto Serif TC', serif;
    color: #5c1e0a;
    display: flex;
    flex-direction: column;
  }

  &__content {
    display: flex;
    flex-direction: row;
  }

  &__left {
    width: 50%;
    padding: 6px;
    display: flex;
    flex-direction: column;
    border-right: 1px dashed #a63d1e;
  }

  &__left-header,
  &__left-content {
    display: flex;
    flex-direction: row;
    justify-content: end;
    margin-bottom: 12px;
  }

  &__right {
    width: 50%;
    padding: 6px;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: flex-start;
  }

  &__right-poem,
  &__right-title {
    display: flex;
    align-items: center;
  }

  &__footer {
    width: 100%;
    border-top: 1px dashed #a63d1e;
    padding: 12px 16px;
    text-align: center;
  }

  &__note {
    font-size: 14px;
    line-height: 1.6;
  }

  .vertical {
    writing-mode: vertical-rl;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
  }
}
.highlight-text {
  color: #a53b25;
}
</style>
