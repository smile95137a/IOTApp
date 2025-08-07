<template>
  <section class="worship">
    <SectionBackground variant="red" />
    <div class="worship__container">
      <Title :text="`請神方法`" color="light" />
      <ul class="worship__tabs">
        <li
          class="worship__tab"
          :class="{ 'worship__tab--active': activeTab === 'about' }"
          @click="activeTab = 'about'"
        >
          關於請神服務
        </li>
        <li
          class="worship__tab"
          :class="{ 'worship__tab--active': activeTab === 'how' }"
          @click="activeTab = 'how'"
        >
          神明供奉說明
        </li>
        <li
          class="worship__tab"
          :class="{ 'worship__tab--active': activeTab === 'upgrade' }"
          @click="activeTab = 'upgrade'"
        >
          神明升級方法
        </li>
      </ul>

      <div class="worship__content">
        <!-- Tab 1: 關於請神服務 -->
        <div v-if="activeTab === 'about'" class="worship__cards">
          <div
            class="worship__card"
            v-for="(item, index) in steps"
            :key="item.id"
          >
            <div class="worship__card-badge">
              <img :src="badge" alt="步驟徽章" class="worship__badge" />
              <div class="worship__card-badge-text">{{ index + 1 }}</div>
            </div>
            <div class="worship__card-left">
              <img
                :src="menuDecoBottom"
                alt="步驟徽章"
                class="worship__badge"
              />
            </div>
            <div class="worship__card-right">
              <img :src="menuDecoTop" alt="步驟徽章" class="worship__badge" />
            </div>
            <div class="worship__card-content">
              <p class="worship__text" v-html="item.text"></p>
            </div>
          </div>
        </div>

        <!-- Tab 2: 神明供奉說明 -->
        <div v-else-if="activeTab === 'how'" class="worship__cards">
          <div
            class="worship__card"
            v-for="(item, index) in steps2"
            :key="item.id"
          >
            <div class="worship__card-badge">
              <img :src="badge" alt="步驟徽章" class="worship__badge" />
              <div class="worship__card-badge-text">{{ index + 1 }}</div>
            </div>
            <div class="worship__card-left">
              <img
                :src="menuDecoBottom"
                alt="步驟徽章"
                class="worship__badge"
              />
            </div>
            <div class="worship__card-right">
              <img :src="menuDecoTop" alt="步驟徽章" class="worship__badge" />
            </div>
            <div class="worship__card-content">
              <p class="worship__text" v-html="item.text"></p>
            </div>
          </div>
        </div>

        <!-- Tab 3: 神明升級方法 -->
        <div v-else-if="activeTab === 'upgrade'" class="worship__cards">
          <div
            class="worship__card"
            v-for="(item, index) in steps3"
            :key="item.id"
          >
            <div class="worship__card-badge">
              <img :src="badge" alt="步驟徽章" class="worship__badge" />
              <div class="worship__card-badge-text">{{ index + 1 }}</div>
            </div>
            <div class="worship__card-left">
              <img
                :src="menuDecoBottom"
                alt="步驟徽章"
                class="worship__badge"
              />
            </div>
            <div class="worship__card-right">
              <img :src="menuDecoTop" alt="步驟徽章" class="worship__badge" />
            </div>
            <div class="worship__card-content">
              <p class="worship__text" v-html="item.text"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Title from '@/components/common/Title.vue';
import badge from '@/assets/image/badge.png';
import menuDecoBottom from '@/assets/image/menu-deco-bottom.png';
import menuDecoTop from '@/assets/image/menu-deco-top.png';
import SectionBackground from '@/components/common/SectionBackground.vue';

const activeTab = ref('about');

const steps = [
  {
    id: 1,
    text: '每天登入會員後,即可向金好神擲筊算運勢一次,每天每尊神明限擲一次筊。',
  },
  {
    id: 2,
    text: `只要擲到3個(含)以上聖筊,即可添加香油錢將神明供奉在會員首頁、供奉大廳。
        <br>
        添香油錢NT$20元可延長7天供奉
        <br>
        添香油錢NT$60元可延長30天供奉`,
  },
  {
    id: 3,
    text: `每尊神明24小時內只能請一次。若您已成功請神,須待24小時後,才能再度擲筊`,
  },
];
const steps2 = [
  {
    id: 1,
    text: '成功請到的所有神明,都會出現在供奉大廳中。當您成功請到神明之後,即可進入「供奉大廳」與供奉的神明進行互動。',
  },
  {
    id: 2,
    text: `供花獻果：
<br>
每日可點擊貢獻3份供品，貢品隨機取得。
<br><br>
神明開示：
<br>
每日可點擊1次，抽籤取得每日運勢解析。
<br><br>
延長供奉：
<br>
點擊【延長供奉】按鈕，再度參與擲筊，獲得3個以上的聖筊，即可延長供奉天數。`,
  },
  {
    id: 3,
    text: `如何延長供奉天數
    <br>
添加少少香油錢,就能延長神明保庇時間喔！
<br><br>
只要神明還供奉在您的會員首頁與供奉大廳,您就可透過【好運神筊】參與擲筊,擲筊成功後,即可添加香油錢以延長供奉期間。
<br><br>
・添香油錢NT$30元 可延長7天的供奉期
<br>
・添香油錢NT$60元  可延長30天的供奉期`,
  },
];
const steps3 = [
  {
    id: 1,
    text: '每日供花獻果以提升神明等級，當神明等級達到Lv5，金神明將會降駕護祐您24小時！',
  },
  {
    id: 2,
    text: `點擊供桌上的【點擊供奉】按鈕,將隨機獻上供品。`,
  },
  {
    id: 3,
    text: `目前供品有:水果、鮮花、元寶。各供品積分說明如下：
    <br>
鮮花：＋2分
<br>
水果：＋5分
<br>
元寶：＋10分
<br>
<br>
當神明等級條達到LV5時，頁面就會出現【升級金神明】的按鈕，點擊按鈕，即可供奉金神明。金神明供奉時間為24小時，時間到即恢復成原身。`,
  },
];
</script>

<style scoped lang="scss">
.worship {
  width: 100%;
  position: relative;
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }
  &__title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }

  &__wave {
    width: 60px;
    height: auto;
  }

  &__tabs {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 6rem;
    padding: 0;
    list-style: none;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__tab {
    font-weight: bold;
    font-size: 15px;
    cursor: pointer;
    padding-bottom: 4px;
    color: #fff;
    &--active {
      border-bottom: 2px solid #fff;
    }
  }

  &__content {
    display: flex;
    justify-content: center;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 6rem;
    justify-content: center;

    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
  }

  &__card {
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 30px;
    padding: 2rem 1rem 4rem 1rem;
    max-width: 390px;
    min-height: 236px;
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(6px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    color: #fff;

    @media (max-width: 768px) {
      width: 100%;
    }
  }

  &__card-badge {
    position: absolute;
    top: -44px;
    left: 50%;
    width: 88px;
    height: 88px;
    transform: translateX(-50%);
    z-index: 2;

    .worship__card-badge-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      font-weight: bold;
      color: #efa576;
    }
  }

  &__card-left {
    position: absolute;
    left: 1rem;
    bottom: 1rem;

    img {
      width: 40px;
      height: 40px;
    }
  }

  &__card-right {
    position: absolute;
    right: 1rem;
    top: 1rem;

    img {
      width: 40px;
      height: 40px;
    }
  }

  &__card-content {
    margin-top: 3rem;
    padding: 0 1rem;
  }

  &__text {
    font-size: 14px;
    line-height: 1.8;
  }

  &__text-block {
    max-width: 700px;
    padding: 2rem 1rem;
    text-align: center;
    font-size: 15px;
    line-height: 1.8;
  }
}
</style>
