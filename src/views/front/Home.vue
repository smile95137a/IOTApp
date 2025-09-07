<template>
  <section class="home-main">
    <!-- 🔹 輪播區 -->
    <div class="home-main__banner" v-if="banners.length">
      <Swiper
        :modules="[Navigation, Autoplay]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false } as any"
        :navigation="true as any"
        class="home-main__swiper"
      >
        <SwiperSlide v-for="(banner, idx) in banners" :key="banner.bannerUid">
          <!-- 如果有新聞就連到新聞頁，否則只顯示圖片 -->
          <a v-if="banner.news" :href="`/news/${banner.news.newsUid}`">
            <img
              :src="getImageUrl(banner.imageUrl)"
              :alt="banner.news.title"
              class="home-main__banner-img"
            />
          </a>
          <img
            v-else
            :src="getImageUrl(banner.imageUrl)"
            :alt="`banner-${idx}`"
            class="home-main__banner-img"
          />
        </SwiperSlide>
      </Swiper>
    </div>

    <!-- 🔹 卡片區 -->
    <div class="home-main__cards">
      <div
        class="home-main__card"
        v-for="item in cards"
        :key="item.title"
        @click="navigate(item.link)"
      >
        <div class="home-main__card-button">
          <i :class="item.icon" />
          <span>{{ item.title }}</span>
          <i class="fas fa-chevron-right home-main__card-arrow" />
        </div>
        <div class="home-main__card-desc">{{ item.desc }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getAllBanners } from '@/services/BannerServices';
import { getImageUrl } from '@/utils/ImageUtils';

const router = useRouter();

const isMobile = ref(false);
const banners = ref<any[]>([]);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(async () => {
  checkMobile();
  window.addEventListener('resize', checkMobile);

  try {
    const res = await getAllBanners();
    banners.value = res.data || [];
  } catch (err) {
    console.error('載入 Banner 失敗', err);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

const navigate = (link: string) => {
  router.push(link);
};

const cards = [
  {
    title: '門市探索',
    desc: '',
    icon: 'fas fa-store',
    link: '/store',
  },
  {
    title: '掃碼開台',
    desc: '掃描球桌上的 QRcode 開台/開燈',
    icon: 'fas fa-qrcode',
    link: '/scan',
  },
  {
    title: '預約開台',
    desc: '選擇門市預約開台',
    icon: 'fas fa-clock',
    link: '/bookStore',
  },
];
</script>

<style scoped lang="scss">
.home-main {
  padding: 2rem 1rem;
  color: white;

  &__banner {
    margin-bottom: 2rem;

    .home-main__banner-img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: 16px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);

      @media (min-width: 768px) {
        height: 280px;
      }
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
      gap: 2.5rem;
    }
  }

  &__card {
    background: linear-gradient(145deg, #1f1c5c, #141238);
    border-radius: 20px;
    padding: 1.8rem 1.2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.35);

    @media (min-width: 768px) {
      width: 280px;
      height: 190px;
    }

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.5);
    }

    &-button {
      background: linear-gradient(90deg, #ffc400, #ffda5b);
      border-radius: 50px;
      padding: 0.6rem 1.2rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: bold;
      color: #000;
      font-size: 1rem;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.25);

      i {
        font-size: 1.2rem;
      }
    }

    &-arrow {
      margin-left: auto;
      transition: transform 0.3s ease;
    }

    &:hover &-arrow {
      transform: translateX(4px);
    }

    &-desc {
      color: #00d4ff;
      font-size: 0.9rem;
      margin-top: 1.2rem;
      line-height: 1.4;
      letter-spacing: 0.5px;
    }
  }
}
</style>
