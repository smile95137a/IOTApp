<template>
  <div class="my-light">
    <SectionBackground variant="divination" />
    <div class="my-light__container">
      <Title color="white" text="我的祈福燈" />
      <div class="my-light__header">
        <p class="my-light__description">
          以下是您目前供奉中的祈福燈，點擊可查看詳細資料與加強供奉。
        </p>
      </div>

      <LightBlessingTabs />

      <template v-if="activeLamps.length > 0">
        <div class="my-light__grid">
          <div
            v-for="lamp in activeLamps"
            :key="lamp.id"
            class="my-light__item"
            @click="selectLamp(lamp)"
          >
            <img
              :src="imageMap[lamp.lanternCode]"
              :alt="lamp.name"
              class="my-light__item-image"
            />
            <div class="my-light__item-info">
              <p class="my-light__item-name">{{ lamp.name }}</p>
              <p class="my-light__item-period">
                剩餘 {{ calcDaysLeft(lamp.expiredTime) }} 天
              </p>
            </div>
          </div>
        </div>

        <MCard v-if="selectedLamp">
          <div class="lamp-info">
            <div class="lamp-info__block">
              <div class="lamp-info__title">
                <div class="lamp-info__title-text">祈福資訊</div>
              </div>
              <div class="lamp-info__content">
                <p>祈福者：{{ selectedLamp.name }}</p>
                <p>生日：{{ formatDate(selectedLamp.birthday) }}</p>
                <p>訊息：{{ selectedLamp.message }}</p>
                <p>剩餘天數：{{ calcDaysLeft(selectedLamp.expiredTime) }} 天</p>
              </div>
            </div>
          </div>
        </MCard>
      </template>

      <NoData v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NoData from '@/components/common/NoData.vue';
import SectionBackground from '@/components/common/SectionBackground.vue';
import Title from '@/components/common/Title.vue';
import MCard from '@/components/common/MCard.vue';
import LightBlessingTabs from '@/components/front/LightBlessingTabs.vue';
import lightImages from '@/data/lightImages';
import { executeApi } from '@/utils/executeApiUtils';
import { getMyActiveLanterns } from '@/services/lanternServices';
import { useAuthFrontStore } from '@/stores/authFrontStore';
import moment from 'moment';

const router = useRouter();
const authStore = useAuthFrontStore();

const activeLamps = ref<any[]>([]);
const selectedLamp = ref<any | null>(null);

// 建立 iconName 對應圖片 map
const imageMap = Object.fromEntries(
  lightImages.map((item) => [item.key, item.image])
);

const calcDaysLeft = (expiredTime: string) => {
  const now = moment();
  const end = moment(expiredTime);
  return Math.max(end.diff(now, 'days'), 0);
};

const formatDate = (val: string) => {
  return val ? moment(val).format('YYYY/MM/DD') : '-';
};

const selectLamp = (lamp: any) => {
  selectedLamp.value = {
    ...lamp,
    records: lamp.records ?? [],
  };
};

const fetchData = async () => {
  await executeApi({
    fn: () => getMyActiveLanterns(),
    errorTitle: '取得資料失敗',
    onSuccess: (data) => {
      activeLamps.value = data ?? [];
    },
  });
};

onMounted(async () => {
  if (!authStore.isLogin) {
    router.replace({ name: 'Login' });
    return;
  }
  await fetchData();
});
</script>

<style scoped lang="scss">
.my-light {
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
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1.5rem;
    justify-items: center;
    margin-bottom: 2rem;
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

  &__item-info {
    margin-top: 0.5rem;
  }

  &__item-name {
    font-weight: bold;
    color: #a2352c;
    font-size: 1rem;
  }

  &__item-period {
    font-size: 0.85rem;
    color: #444;
  }
}

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
